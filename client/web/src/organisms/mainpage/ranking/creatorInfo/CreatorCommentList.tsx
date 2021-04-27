import {
  Button, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import {
  ICreatorCommentsRes, ICreatorCommentData,
} from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CommentItem from '../sub/CommentItem';
import { useCreatorCommentListStyle } from '../style/CreatorComment.style';
import RegularButton from '../../../../atoms/Button/Button';
import CommentForm from '../sub/CommentForm';
import axios from '../../../../utils/axios';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

export function isReportedIn24Hours(date: string): boolean {
  const now = dayjs();
  const targetDate = dayjs(date);
  return now.diff(targetDate, 'hour') < 24;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  commentSectionWrapper: {
    padding: theme.spacing(8),
    paddingBottom: theme.spacing(20),
    border: `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`,
    backgroundImage: 'url(/images/rankingPage/streamer_detail_bg_2.svg), url(/images/rankingPage/streamer_detail_bg_3.svg)',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'left center, left bottom',
    backgroundSize: '100% 100%, contain',
  },
}));

type CommentFilter = 'date' | 'recommend';
export interface CreatorCommentListProps{
  creatorId: string;
}

const filters = ['recommend', 'date'];

export default function CreatorCommentList(props: CreatorCommentListProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const listStyle = useCreatorCommentListStyle();
  const authContext = useAuthContext();
  const classes = useStyles();
  const { creatorId } = props;
  const [commentList, setCommentList] = useState<ICreatorCommentData[]>([]);
  const [clickedFilterButtonIndex, setClickedFilterButtonIndex] = useState<number>(0); //  0 : 인기순(recommend), 1 : 최신순(date)
  const [{ data: commentData, loading }, getCommentData] = useAxios<ICreatorCommentsRes>({
    url: `/creatorComment/${creatorId}`,
    method: 'get',
    params: {
      skip: 0,
      order: 'date',
    },
  });
  const loadComments = useCallback((filter: CommentFilter) => {
    getCommentData({
      params: {
        skip: 0,
        order: filter,
      },
    }).then((res) => {
      setCommentList(res.data.comments);
    }).catch((error) => {
      console.error(error);
    });
  }, [getCommentData]);

  const loadMoreComments = useCallback(() => {
    getCommentData({
      params: {
        skip: commentList.length,
        order: filters[clickedFilterButtonIndex],
      },
    }).then((res) => {
      setCommentList((prevList) => [...prevList, ...res.data.comments]);
    }).catch((error) => {
      console.error(error);
    });
  }, [clickedFilterButtonIndex, commentList.length, getCommentData]);

  useEffect(() => {
    loadComments('recommend');
  // 한번만 실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadComments = useCallback(() => {
    loadComments(clickedFilterButtonIndex === 1 ? 'date' : 'recommend');
  }, [clickedFilterButtonIndex, loadComments]);

  const handleRecommendFilter = useCallback(() => {
    setClickedFilterButtonIndex(0);
    loadComments('recommend');
  }, [loadComments]);

  const handleDateFilter = useCallback(() => {
    setClickedFilterButtonIndex(1);
    loadComments('date');
  }, [loadComments]);

  const onReport = useCallback((commentId: number) => {
    const reportList: {id: number, date: string}[] = JSON.parse(localStorage.getItem('reportList') || '[]');
    const commentsRecentlyReported = reportList.filter((item) => isReportedIn24Hours(item.date));
    const commentIds = commentsRecentlyReported.map((item) => item.id);

    const currentCommentId = commentId;

    if (commentIds.includes(currentCommentId)) {
      ShowSnack('이미 신고한 댓글입니다', 'error', enqueueSnackbar);
      localStorage.setItem('reportList', JSON.stringify([...commentsRecentlyReported]));
      return;
    }
    // 현재  commentId가 로컬스토리지에 저장되어 있지 않다면 해당 글 신고하기 요청
    axios.post(`/creatorComment/report/${commentId}`)
      .then((res) => {
        localStorage.setItem('reportList', JSON.stringify([...commentsRecentlyReported, { id: currentCommentId, date: new Date() }]));
      })
      .catch((err) => {
        ShowSnack('댓글 신고 오류', 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar]);

  const onClickLike = useCallback((commentId: number) => axios.post(
    `creatorComment/vote/${commentId}`,
    { vote: 1, userId: authContext.user.userId },
  )
    .then((res) => {
      const result = res.data;
      return new Promise(((resolve, reject) => {
        resolve(result);
      }));
    })
    .catch((error) => console.error(error)), [authContext.user.userId]);

  const onClickHate = useCallback((commentId: number) => axios.post(
    `creatorComment/vote/${commentId}`,
    { vote: 0, userId: authContext.user.userId },
  )
    .then((res) => {
      const result = res.data;
      return new Promise(((resolve, reject) => {
        resolve(result);
      }));
    })
    .catch((error) => console.error(error)), [authContext.user.userId]);

  const onDelete = useCallback((commentId: number) => (
    axios.delete(`/creatorComment/${commentId}`)
      .then((res) => new Promise((resolve, reject) => resolve(res)))
      .catch((error) => console.error(error))
  ), []);

  const loadChildrenComments = useCallback((commentId: number) => axios.get(`creatorComment/replies/${commentId}`)
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    }))
    .catch((error) => console.error(error)), []);

  const checkPasswordRequest = useCallback((commentId, password) => axios.post(`/creatorComment/password/${commentId}`, { password })
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    })),
  []);

  return (
    <div className={classes.commentSectionWrapper}>
      <CommentForm
        postUrl={`/creatorComment/${creatorId}`}
        callback={reloadComments}
      />

      <div className={listStyle.commentsContainer}>
        <div className={listStyle.commentFilterContainer}>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 0 })}
            onClick={handleRecommendFilter}
          >
            인기순
          </Button>
          <Button
            startIcon={<CheckIcon />}
            className={classnames(listStyle.commentFilterButton, { selected: clickedFilterButtonIndex === 1 })}
            onClick={handleDateFilter}
          >
            최신순
          </Button>

        </div>
        <div className={listStyle.commentListContainer}>
          {
          commentList.length
            ? commentList.map((d) => (
              <CommentItem
                key={d.commentId}
                {...d}
                targetId={d.commentId}
                onReport={onReport}
                onClickLike={onClickLike}
                onClickHate={onClickHate}
                onDelete={onDelete}
                reloadComments={reloadComments}
                loadChildrenComments={loadChildrenComments}
                checkPasswordRequest={checkPasswordRequest}
                childrenCommentPostBaseUrl="/creatorComment/replies"
              />
            ))
            : (
              <Typography className={listStyle.emptyList}>아직 댓글이 없어요! 첫 댓글을 남겨보세요.</Typography>
            )
        }
        </div>

      </div>

      <div className={listStyle.buttonWrapper}>
        {commentData
        && (commentData.count > commentList.length)
        && <RegularButton onClick={loadMoreComments} load={loading}>더보기</RegularButton>}
      </div>

    </div>
  );
}
