import {
  Button, Container, Paper, Typography,
} from '@material-ui/core';
import classnames from 'classnames';
// 타입정의
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
// 스타일
import 'suneditor/dist/css/suneditor.min.css'; // suneditor로 작성된 컨텐츠를 표시하기 위해 필요함
import CenterLoading from '../../../atoms/Loading/CenterLoading';
// 하위 컴포넌트
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import useBoardState from '../../../utils/hooks/useBoardListState';
import CheckPasswordDialog from '../shared/CheckPasswordDialog';
import BoardContainer from './list/BoardContainer';
import PostInfoCard from './postView/PostInfoCard';
import RepliesContainer from './postView/RepliesContainer';
import BoardTitle, { PLATFORM_NAMES } from './share/BoardTitle';
import { isWithin24Hours } from '../ranking/creatorInfo/CreatorCommentList';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import { useStyles, SUN_EDITOR_VIEWER_CLASSNAME } from './style/CommunityBoardView.style';

// PostList 컴포넌트의 moveToPost 함수에서 history.push({state:})로 넘어오는 값들
interface LocationState{
  page: number,
  take: number
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
    getPost: '존재하지 않는 글입니다. 목록페이지로 이동합니다',
    postRecommend: '추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    postNotRecommend: '비추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
    duplicateRecommend: '동일한 글은 하루에 한 번만 추천 할 수 있습니다',
    duplicateNotRecommend: '동일한 글은 하루에 한 번만 비추천 할 수 있습니다',
    deletePost: '글을 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
  },
};

function FilterButton({ onClick, label }: {
  onClick: () => void,
  label: string
}): JSX.Element {
  const { isMobile } = useMediaSize();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      size={isMobile ? 'small' : undefined}
    >
      {label}
    </Button>
  );
}

interface Params{
  postId: string,
  platform: 'twitch' | 'afreeca' | 'free'
}

export default function CommunityPostView(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();
  const { isMobile } = useMediaSize();

  const { postId, platform } = useParams<Params>();

  const location = useLocation<LocationState>();
  const take = location.state ? location.state.take : 5;
  const initialPage = location.state ? location.state.page : 1;

  // 글수정,삭제버튼 눌렀을 때 어떤 버튼이 눌렸는지 상태 저장 && 다이얼로그 개폐 상태 저장
  const [dialogState, setDialogState] = useState<{open: boolean, context: 'edit'|'delete'}>({ open: false, context: 'edit' });
  // 개별글 내용 요청
  const [{ data: currentPost }, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
  // 개별글 추천 요청
  const [{ data: recommendCount }, postRecommend] = useAxios<number>({
    url: `/community/posts/${postId}/recommend`,
    method: 'post',
  }, { manual: true });
    // 개별글 비추천 요청
  const [{ data: notRecommendCount }, postNotRecommend] = useAxios<number>({
    url: `/community/posts/${postId}/notRecommend`,
    method: 'post',
  }, { manual: true });

  // 개별글 삭제 요청
  const [, deletePost] = useAxios({ url: `/community/posts/${postId}`, method: 'delete' }, { manual: true });

  // 게시판 상태
  const {
    pagenationHandler,
    boardState,
    changeFilter,
    handlePostsLoad,
  } = useBoardState({ page: initialPage });

  // 개별글 내용 post.content를 표시할 element
  const viewerRef = useRef<any>();

  /**
   * 댓글 페이지네이션 관련
   */
  const maxReplyToDisplay = useRef<number>(10); // 댓글 최대 10개 표시
  const [replyPage, setReplyPage] = useState<number>(1); // 현재 댓글 페이지
  // 댓글 요청 함수
  const [{ data: replies }, getReplies] = useAxios<FindReplyResType>({
    url: '/community/replies',
    params: {
      postId,
      take: maxReplyToDisplay.current,
      page: replyPage,
    },
  });

  useEffect(() => {
    loadReplies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyPage]);

  // 댓글 페이지 변경 핸들러
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
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    }).catch((e) => {
      console.error('글 불러오기 오류', e);
      ShowSnack(snackMessages.error.getPost, 'error', enqueueSnackbar);
      history.push('/community-board');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 댓글 다시 불러오는 함수
  const loadReplies = useCallback(() => {
    if (!currentPost) return;
    getReplies({
      params: {
        postId,
        take: maxReplyToDisplay.current,
        page: replyPage,
      },
    }).catch((e) => {
      if (e.response) {
        console.error(e.response.data, e.response.status);
        ShowSnack(snackMessages.error.getReplies, 'error', enqueueSnackbar);
      }
      console.error(e);
    });
  }, [currentPost, enqueueSnackbar, getReplies, postId, replyPage]);

  // 글 추천버튼 핸들러(하루 한번만 추천하도록)
  const handleRecommend = useCallback(() => {
    const RECOMMEND_LIST_KEY = 'recommendList';
    const recommendList: {id: number, date: string}[] = JSON.parse(localStorage.getItem(RECOMMEND_LIST_KEY) || '[]');
    const postsRecentlyRecommended = recommendList.filter((item) => isWithin24Hours(item.date));
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
        localStorage.setItem(RECOMMEND_LIST_KEY,
          JSON.stringify([
            ...postsRecentlyRecommended,
            { id: currentPostId, date: new Date() },
          ]));
      })
      .catch((err) => {
        ShowSnack(snackMessages.error.postRecommend, 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar, postId, postRecommend]);

  // 글 비추천버튼 핸들러
  const handleNotRecommend = useCallback(() => {
    const NOT_RECOMMEND_LIST_KEY = 'notRecommendList';
    const notRecommendList: {id: number, date: string}[] = JSON.parse(localStorage.getItem(NOT_RECOMMEND_LIST_KEY) || '[]');
    const postsRecentlyNotRecommended = notRecommendList.filter((item) => isWithin24Hours(item.date));
    const postIds = postsRecentlyNotRecommended.map((item) => item.id);

    const currentPostId = Number(postId);

    if (postIds.includes(currentPostId)) {
      ShowSnack(snackMessages.error.duplicateNotRecommend, 'error', enqueueSnackbar);
      return;
    }

    postNotRecommend()
      .then((res) => {
        localStorage.setItem(NOT_RECOMMEND_LIST_KEY,
          JSON.stringify([
            ...postsRecentlyNotRecommended,
            { id: currentPostId, date: new Date() },
          ]));
      })
      .catch((err) => {
        ShowSnack(snackMessages.error.postNotRecommend, 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar, postId, postNotRecommend]);

  // 전체 게시판 페이지로 이동
  const moveToBoardList = useCallback(() => {
    history.push('/community-board');
  }, [history]);

  /**
   * 다이얼로그 관련
   */
  // 글수정 페이지로 이동
  const moveToEditPostPage = useCallback(() => {
    history.push(`/community-board/${platform}/write/${postId}`);
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

  const [, checkPassword] = useAxios({ url: `/community/posts/${postId}/password`, method: 'post' }, { manual: true });

  return (
    <Container maxWidth="md" className="postView">
      <BoardTitle platform={platform} title={`${PLATFORM_NAMES[platform]}게시판`} />

      {currentPost ? (
        <PostInfoCard
          post={currentPost}
          repliesCount={replies ? replies.total : 0}
        />
      ) : (
        <CenterLoading />
      )}

      <Paper className={classes.viewer}>
        <div ref={viewerRef} className={SUN_EDITOR_VIEWER_CLASSNAME} />

        <div className={classes.recommendContainer}>
          <div className={classes.recommendButtons}>
            <Typography>{recommendCount || (currentPost && currentPost.recommend) || 0}</Typography>
            <Button
              size={isMobile ? 'small' : undefined}
              className={classnames(classes.recommendButton)}
              onClick={handleRecommend}
              variant="contained"
              color="primary"
            >
              <img
                width={isMobile ? 24 : 36}
                height={isMobile ? 24 : 36}
                src="/images/rankingPage/thumb_up.png"
                alt="추천"
              />
              <Typography className="buttonText">추천</Typography>
            </Button>
            <Button
              size={isMobile ? 'small' : undefined}
              className={classnames(classes.recommendButton, 'not')}
              onClick={handleNotRecommend}
              variant="contained"
              color="default"
            >
              <img
                width={isMobile ? 24 : 36}
                height={isMobile ? 24 : 36}
                src="/images/rankingPage/thumb_down.png"
                alt="비추천"
              />
              <Typography className="buttonText">비추</Typography>
            </Button>
            <Typography>{notRecommendCount || (currentPost && currentPost.notRecommendCount) || 0}</Typography>
          </div>
        </div>
      </Paper>

      <div className={classes.buttonsContainer}>
        <FilterButton onClick={moveToBoardList} label="전체 게시판 목록보기" />
        <FilterButton onClick={editPostButtonHandler} label="글수정" />
        <FilterButton onClick={deletePostButtonHandler} label="글삭제" />
      </div>

      {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}
      <CheckPasswordDialog
        open={dialogState.open}
        onClose={closeDialog}
        checkPassword={checkPassword}
        successHandler={dialogSubmitFunction}
      >
        {dialogState.context === 'delete' ? <Typography>게시글 삭제시 복구가 불가능합니다</Typography> : undefined}
      </CheckPasswordDialog>
      {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}

      <RepliesContainer
        replies={replies}
        loadReplies={loadReplies}
        replyPage={replyPage}
        replyCountPerPage={maxReplyToDisplay.current}
        changeReplyPage={changeReplyPage}
        postId={postId}
        setReplyPage={setReplyPage}
      />

      <BoardContainer
        platform={platform}
        take={take}
        pagenationHandler={pagenationHandler}
        boardState={boardState}
        postFilterHandler={changeFilter}
        handlePostsLoad={handlePostsLoad}
        currentPostId={Number(postId)}
      />
    </Container>

  );
}
