import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container, Typography,
  Paper,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import * as dateFns from 'date-fns';
import { useSnackbar } from 'notistack';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import { Pagination } from '@material-ui/lab';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import PostInfoCard from '../../organisms/mainpage/communityBoard/postView/PostInfoCard';
import 'suneditor/dist/css/suneditor.min.css'; // suneditor로 작성된 컨텐츠를 표시하기 위해 필요함
import ShowSnack from '../../atoms/snackbar/ShowSnack';
import CustomDialog from '../../atoms/Dialog/Dialog';
import CheckPasswordForm from '../../organisms/mainpage/communityBoard/postView/CheckPasswordForm';
import RepliesSection from '../../organisms/mainpage/communityBoard/postView/RepliesSection';
import ReplyForm from '../../organisms/mainpage/communityBoard/postView/ReplyForm';
import useBoardState, { FilterType } from '../../utils/hooks/useBoardListState';
import BoardContainer from '../../organisms/mainpage/communityBoard/list/BoardContainer';

const useStyles = makeStyles((theme: Theme) => createStyles({
  boardTitle: {},
  headerCard: {},
  viewer: {},
  recommendContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3, 0),
  },
  recommendCard: {
    display: 'flex',
  },
  buttons: {
    padding: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'space-between',
  },
  postButtons: {
    '&>*+*': {
      marginLeft: theme.spacing(1),
    },
  },
  pagenation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

// organisms>mainpage>communityBoard>list>PostList에서
// moveToPost 함수에서 history.push({state:})로 넘어오는 값들
interface LocationState{
  platform: 'afreeca'|'twitch';
  page: number,
  take: number
}

const SUN_EDITOR_VIEWER_CLASSNAME = 'sun-editor-editable'; // suneditor로 작성된 글을 innerHTML로 넣을 때 해당 엘리먼트에 붙어야 할 클래스네임

// 추천시간이 24시간 이내인지 확인하는 함수
function isRecommendedWithin24Hours(createDate: string): boolean {
  const today = new Date();
  const recommendedDay = new Date(createDate);
  const hourDiff = dateFns.differenceInHours(today, recommendedDay);
  return hourDiff < 24;
}

/**
 * 스낵바에서 보여줄 메시지
 */
const snackMessages = {
  success: {
    deletePost: '해당 글이 삭제되었습니다',
  },
  error: {
    getReplies: '댓글 내용을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요',
    getPost: '글 내용 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요',
    postRecommend: '추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    duplicateRecommend: '동일한 글은 하루에 한 번만 추천 할 수 있습니다',
    deletePost: '글을 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
  },
};

export default function CommunityPostView(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const history = useHistory();
  const { postId } = useParams<any>();

  const location = useLocation<LocationState>();
  const { platform } = location.state;
  const take = location.state ? location.state.take : 5;
  const initialPage = location.state ? location.state.page : 1;

  const [dialogState, setDialogState] = useState<{open: boolean, context: 'edit'|'delete'}>({ open: false, context: 'edit' });
  const [{ data: currentPost }, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
  const [{ data: recommendCount }, postRecommend] = useAxios<number>({ url: `/community/posts/${postId}/recommend`, method: 'post' }, { manual: true });
  const [, deletePost] = useAxios({ url: `/community/posts/${postId}`, method: 'delete' }, { manual: true });

  // 게시판 관련
  const {
    pagenationHandler,
    boardState,
    changeFilter,
    handlePostsLoad,
  } = useBoardState({ page: initialPage });
  const filterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    changeFilter(categoryFilter);
  };

  // 글 내용 컨텐츠를 표시할 element
  const viewerRef = useRef<any>();

  /**
   * 댓글 페이지네이션 관련
   */
  const maxReplyToDisplay = useRef<number>(10);
  const [replyPage, setReplyPage] = useState<number>(1);
  const [{ data: replies }, getReplies] = useAxios<FindReplyResType>({ url: `/community/replies?postId=${postId}&take=${maxReplyToDisplay.current}&page=${replyPage}` }, { manual: true });
  const replyPaginationCount = useMemo(() => (
    Math.ceil((replies ? replies.total : 0) / maxReplyToDisplay.current)
  ), [replies]);
  const changeReplyPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (replyPage === newPage) return;
    setReplyPage(newPage);
  };

  /**
   * 페이지 마운트 된 후 postId로 글 내용 불러오기
   */
  useEffect(() => {
    getPostForView().then((res) => {
      if (viewerRef && viewerRef.current) {
        viewerRef.current.innerHTML = res.data.content;
      }
    }).catch((e) => {
      console.error('글 불러오기 오류', e);
      ShowSnack(snackMessages.error.getPost, 'error', enqueueSnackbar);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 댓글 다시 불러오는 함수
  const loadReplies = useCallback(() => {
    getReplies().then((res) => {
      // console.log(res);
    }).catch((e) => {
      console.error('댓글 불러오기 오류', e);
      ShowSnack(snackMessages.error.getReplies, 'error', enqueueSnackbar);
    });
  }, [enqueueSnackbar, getReplies]);

  // replyPage (댓글 페이지네이션) 이 바뀌면 댓글 불러오는 이펙트
  useEffect(() => {
    loadReplies();
  }, [loadReplies, replyPage]);

  // 댓글 추천버튼 핸들러(하루 한번만 추천하도록)
  const handleRecommend = useCallback(() => {
    const recommendList: {id: number, date: string}[] = JSON.parse(localStorage.getItem('recommendList') || '[]');
    const postsRecentlyRecommended = recommendList.filter((item) => isRecommendedWithin24Hours(item.date));
    const postIds = postsRecentlyRecommended.map((item) => item.id);

    const currentPostId = Number(postId);// postId는 param에서 넘어와서 string이다. recommendList의 id값과 비교하기 위해 숫자로 변경

    // localStorage에 저장된 추천글 목록에 현재postId가 들어가있으면 리턴
    if (postIds.includes(currentPostId)) {
      ShowSnack(snackMessages.error.duplicateRecommend, 'error', enqueueSnackbar);
      return;
    }
    // 현재 postId가 로컬스토리지에 저장되어 있지 않다면 해당 글 추천하기 요청
    postRecommend()
      .then((res) => {
        localStorage.setItem('recommendList', JSON.stringify([...postsRecentlyRecommended, { id: currentPostId, date: new Date() }]));
      })
      .catch((err) => {
        ShowSnack(snackMessages.error.postRecommend, 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar, postId, postRecommend]);

  // 전체 게시판 페이지로 이동
  const moveToBoardList = useCallback(() => {
    history.push('/community-board');
  }, [history]);

  /**
   * 다이얼로그 관련
   */
  // 글수정 페이지로 이동
  const moveToEditPostPage = useCallback(() => {
    history.push({
      pathname: `/community-board/write/${postId}`,
      state: {
        platform,
      },
    });
  }, [history, platform, postId]);

  // 글 삭제 요청 핸들러
  const doDeletePost = useCallback(() => {
    deletePost().then(() => {
      ShowSnack(snackMessages.success.deletePost, 'info', enqueueSnackbar);
      setDialogState((prevState) => ({ ...prevState, open: false }));
      history.push('/community-board');
    }).catch((e) => {
      console.error(e);
      ShowSnack(snackMessages.error.deletePost, 'error', enqueueSnackbar);
    });
  }, [deletePost, enqueueSnackbar, history]);

  // 글 수정버튼 눌렀을 때 다이얼로그 상태 변경
  const editPostButtonHandler = useCallback(() => {
    setDialogState({ open: true, context: 'edit' });
  }, []);
  // 글 삭제버튼 눌렀을 때 다이얼로그 상태 변경
  const deletePostButtonHandler = useCallback(() => {
    setDialogState({ open: true, context: 'delete' });
  }, []);
  // 다이얼로그에서 비밀번호 확인 후 진행할 함수
  // context === 'edit' 이면 moveToEditPostPage 
  // context === 'delete' 이면 doDeletePost
  const dialogSubmitFunction = useMemo(() => (
    dialogState.context === 'edit'
      ? moveToEditPostPage
      : doDeletePost
  ), [dialogState.context, doDeletePost, moveToEditPostPage]);
  // 다이얼로그 닫기 위한 함수, 다이얼로그 상태 open : false로 바꾼다
  const closeDialog = useCallback(() => setDialogState((prevState) => ({ ...prevState, open: false })), []);

  // 다이얼로그 닫고 난 후 실행되는 함수, 사용하지 않지만 다이얼로그 컴포넌트에서 요구하는 props라서 일단 둠
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onDialogClose = useCallback(() => {}, []);

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <BoardTitle platform={platform} />

        {currentPost ? (
          <>
            <PostInfoCard post={currentPost} />
          </>
        ) : (
          <CenterLoading />
        )}

        <Paper className={classes.viewer}>
          <div ref={viewerRef} className={SUN_EDITOR_VIEWER_CLASSNAME} />
          <div className={classes.recommendContainer}>
            <Card className={classes.recommendCard}>
              <CardContent>
                <Typography>{`추천 ${recommendCount || currentPost?.recommend || 0}`}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={handleRecommend} variant="contained" color="primary">
                  추천하기
                </Button>
              </CardActions>
            </Card>
          </div>
        </Paper>

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            onClick={moveToBoardList}
          >
            전체 게시판 목록보기
          </Button>
          <div className={classes.postButtons}>
            <Button
              variant="contained"
              color="primary"
              onClick={editPostButtonHandler}
            >
              글수정
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={deletePostButtonHandler}
            >
              글삭제
            </Button>
          </div>
        </div>

        {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}
        <CustomDialog
          open={dialogState.open}
          onClose={onDialogClose}
        >
          <CheckPasswordForm
            closeDialog={closeDialog}
            postId={postId}
            successHandler={dialogSubmitFunction}
          >
            {dialogState.context === 'delete' ? <Typography>게시글 삭제시 복구가 불가능합니다</Typography> : undefined}
          </CheckPasswordForm>
        </CustomDialog>
        {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}

        <RepliesSection
          totalReplyCount={replies ? replies.total : 0}
          replies={replies ? replies.replies : []}
          loadReplies={loadReplies}
        />

        { replyPaginationCount > 1
          ? (
            <Pagination
              className={classes.pagenation}
              shape="rounded"
              page={replyPage}
              count={replyPaginationCount}
              onChange={changeReplyPage}
            />
          )
          : null}

        <ReplyForm
          postId={postId}
          afterCreateReplyHandler={loadReplies}
        />

        <BoardContainer
          platform={platform}
          take={take}
          pagenationHandler={pagenationHandler}
          searchText=""
          searchType=""
          boardState={boardState}
          postFilterHandler={filterHandler}
          handlePostsLoad={handlePostsLoad}
        />
      </Container>

    </CommunityBoardCommonLayout>
  );
}
