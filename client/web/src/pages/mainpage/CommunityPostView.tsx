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
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import PostInfoCard from '../../organisms/mainpage/communityBoard/postView/PostInfoCard';
import 'suneditor/dist/css/suneditor.min.css'; // suneditor로 작성된 컨텐츠를 표시하기 위해 필요함
import ShowSnack from '../../atoms/snackbar/ShowSnack';
import CustomDialog from '../../atoms/Dialog/Dialog';
import CheckPasswordForm from '../../organisms/mainpage/communityBoard/postView/CheckPasswordForm';
import RepliesSection from '../../organisms/mainpage/communityBoard/postView/RepliesSection';

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
  replyContainer: {},
}));

interface LocationState{
  platform: 'afreeca'|'twitch';
}

const SUN_EDITOR_VIEWER_CLASSNAME = 'sun-editor-editable';

// 추천시간이 24시간 이내인지 확인하는 함수
function isRecommendedWithin24Hours(createDate: string): boolean {
  const today = new Date();
  const recommendedDay = new Date(createDate);
  const hourDiff = dateFns.differenceInHours(today, recommendedDay);
  return hourDiff < 24;
}
const snackMessages = {
  success: {
    deletePost: '해당 글이 삭제되었습니다',
  },
  error: {
    getPost: '글 내용 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요',
    postRecommend: '추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    duplicateRecommend: '동일한 글은 하루에 한 번만 추천 할 수 있습니다',
    deletePost: '글을 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
  },
};

export default function CommunityPostView(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { postId } = useParams<any>();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const platform = location.state ? location.state.platform : undefined;
  const viewerRef = useRef<any>(); // 컨텐츠를 표시할 element
  const [dialogState, setDialogState] = useState<{open: boolean, context: 'edit'|'delete'}>({ open: false, context: 'edit' });
  const [{ data: currentPost }, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
  const [{ data: recommendCount }, postRecommend] = useAxios({ url: `/community/posts/${postId}/recommend`, method: 'post' }, { manual: true });
  const [, deletePost] = useAxios({ url: `/community/posts/${postId}`, method: 'delete' }, { manual: true });

  useEffect(() => {
    // postId로 글 내용 불러오기
    getPostForView().then((res) => {
      if (viewerRef && viewerRef.current) {
        viewerRef.current.innerHTML = res.data.content;
      }
    }).catch((e) => {
      console.error(e);
      ShowSnack(snackMessages.error.getPost, 'error', enqueueSnackbar);
    });
  }, []);

  /**
   * // 동일 글은 하루 한번만 추천하기
     * 로컬스토리지 recommendList를 JSON.parse로 가져와서
     * 하루가 지난 추천글을 filter로 걸러낸다
     * 남은 목록 중 현재 글과 같은 id가 있으면 하루 한번만 추천가능 에러스낵바
     * recommendList가 없거나, 남은 목록 중 현재 글과 같은 id가 없으면 
     * 로컬스토리지 recommendedPost 에 {id: postId, date: new Date()}를 저장 후 해당 글 추천하기 요청
     */
  const handleRecommend = useCallback(() => {
    const recommendList: {id: number, date: string}[] = JSON.parse(localStorage.getItem('recommendList') || '[]');
    const postsRecentlyRecommended = recommendList.filter((item) => isRecommendedWithin24Hours(item.date));
    const postIds = postsRecentlyRecommended.map((item) => item.id);

    if (currentPost && postIds.includes(postId)) {
      ShowSnack(snackMessages.error.duplicateRecommend, 'error', enqueueSnackbar);
      return;
    }

    // 해당 글 추천하기 요청
    postRecommend()
      .then((res) => {
        localStorage.setItem('recommendList', JSON.stringify([...postsRecentlyRecommended, { id: postId, date: new Date() }]));
      })
      .catch((err) => {
        ShowSnack(snackMessages.error.postRecommend, 'error', enqueueSnackbar);
        console.error(err);
      });
  }, []);

  const moveToBoardList = useCallback(() => {
    history.push('/community-board');
  }, [history]);

  const moveToEditPostPage = useCallback(() => {
    history.push({
      pathname: `/community-board/write/${postId}`,
      state: {
        platform,
      },
    });
  }, [history, platform, postId]);

  const doDeletePost = useCallback(() => {
    deletePost().then(() => {
      ShowSnack(snackMessages.success.deletePost, 'info', enqueueSnackbar);
      setDialogState((prevState) => ({ ...prevState, open: false }));
      history.push('/community-board');
    }).catch((e) => {
      console.error(e);
      ShowSnack(snackMessages.error.deletePost, 'error', enqueueSnackbar);
    });
  }, []);

  const editPostButtonHandler = useCallback(() => {
    setDialogState({ open: true, context: 'edit' });
  }, []);
  const deletePostButtonHandler = useCallback(() => {
    setDialogState({ open: true, context: 'delete' });
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onDialogClose = useCallback(() => {}, []);
  const closeDialog = useCallback(() => setDialogState((prevState) => ({ ...prevState, open: false })), []);
  const successHandler = useMemo(() => (dialogState.context === 'edit' ? moveToEditPostPage : doDeletePost), [dialogState.context]);
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
            successHandler={successHandler}
          >
            {dialogState.context === 'delete' ? <Typography>게시글 삭제시 복구가 불가능합니다</Typography> : undefined}
          </CheckPasswordForm>
        </CustomDialog>
        {/* 글수정, 삭제시 비밀번호 확인 다이얼로그 */}

        <RepliesSection
          className={classes.replyContainer}
          totalReplyCount={10}
        />

      </Container>

    </CommunityBoardCommonLayout>
  );
}
