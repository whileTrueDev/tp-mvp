import {
  Button, Container, Paper, Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
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
// 하위 컴포넌트
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import useBoardState from '../../../utils/hooks/useBoardListState';
import CheckPasswordDialog from '../shared/CheckPasswordDialog';
import BoardContainer from './list/BoardContainer';
import PostInfoCard from './postView/PostInfoCard';
import RepliesContainer from './postView/RepliesContainer';
import BoardTitle, { PLATFORM_NAMES } from './share/BoardTitle';
import PostRecommandButtons from './postView/PostRecommandContainer';
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
      style={{ marginRight: '4px' }}
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
  const [{ data: currentPost, loading: postLoading }, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
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

  // 댓글 페이지 변경 핸들러
  const changeReplyPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (replyPage === newPage) return;
    setReplyPage(newPage);
  };

  /**
   * 페이지 마운트 된 후 postId로 글 내용 불러오기
   */

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    getPostForView().then((res) => {
      if (viewerRef && viewerRef.current) {
        viewerRef.current.innerHTML = res.data.content;
      }
    }).catch((e) => {
      console.error('글 불러오기 오류', e);
      ShowSnack(snackMessages.error.getPost, 'error', enqueueSnackbar);
      history.push('/community-board');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    loadReplies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyPage]);

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

      {!postLoading && !!currentPost ? (
        <Paper className={classes.viewer}>
          <PostInfoCard
            post={currentPost}
            repliesCount={replies ? replies.total : 0}
          />
          <div ref={viewerRef} className={SUN_EDITOR_VIEWER_CLASSNAME} />
          <PostRecommandButtons
            isMobile={isMobile}
            currentPost={currentPost}
            postId={postId}
          />
        </Paper>
      ) : (
        <Skeleton variant="rect" height="280px" />
      )}

      <div className={classes.buttonsContainer}>
        <FilterButton onClick={moveToBoardList} label="전체 게시판 목록보기" />
        <div>
          <FilterButton onClick={editPostButtonHandler} label="글수정" />
          <FilterButton onClick={deletePostButtonHandler} label="글삭제" />
        </div>

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
