// 추천 관련 버튼들 컴포넌트
import { Typography, Button } from '@material-ui/core';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import { useStyles } from '../style/PostRecommandContainer.style';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import { isWithin24Hours } from '../../ranking/creatorInfo/CreatorCommentList';
import { useMutatePostVote } from '../../../../utils/hooks/mutation/useMutatePostVote';

interface RecommandProps{
  postId: string | undefined,
  currentPost: CommunityPost,
  isMobile: boolean,
}

const snackMessages = {
  error: {
    postRecommend: '추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    postNotRecommend: '비추천하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
    duplicateRecommend: '동일한 글은 하루에 한 번만 추천 할 수 있습니다',
    duplicateNotRecommend: '동일한 글은 하루에 한 번만 비추천 할 수 있습니다',
  },
};

export default function PostRecommandButtons(props: RecommandProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { postId, currentPost, isMobile } = props;

  const { mutateAsync: vote } = useMutatePostVote();

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
    vote({ postId: Number(postId), vote: 1 })
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
  }, [enqueueSnackbar, postId, vote]);

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

    vote({ postId: Number(postId), vote: 0 })
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
  }, [enqueueSnackbar, postId, vote]);

  return (
    <div className={classes.recommendContainer}>
      <div className={classes.recommendButtons}>
        <Typography className={classes.recommandText}>
          {(currentPost.recommend) || 0}
        </Typography>
        <Button
          size="small"
          className={classnames(classes.recommendButton)}
          onClick={handleRecommend}
          variant="contained"
          color="primary"
        >
          <img
            width={isMobile ? 16 : 32}
            height={isMobile ? 16 : 32}
            src="/images/rankingPage/thumb_up.png"
            alt="추천"
          />
          <Typography className="buttonText">추천</Typography>
        </Button>
        <Button
          size="small"
          className={classnames(classes.recommendButton, 'not')}
          onClick={handleNotRecommend}
          variant="contained"
          color="default"
        >
          <img
            width={isMobile ? 16 : 32}
            height={isMobile ? 16 : 32}
            src="/images/rankingPage/thumb_down.png"
            alt="비추천"
          />
          <Typography className="buttonText">비추</Typography>
        </Button>
        <Typography className={classes.recommandText}>
          {(currentPost.notRecommendCount) || 0}
        </Typography>
      </div>
    </div>
  );
}
