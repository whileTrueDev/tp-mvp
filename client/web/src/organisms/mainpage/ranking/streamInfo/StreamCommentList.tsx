import { Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { IStreamCommentData, IStreamCommentsRes } from '@truepoint/shared/dist/res/StreamCommentResType.interface';
import useAxios from 'axios-hooks';
import RegularButton from '../../../../atoms/Button/Button';
import { useCommentContainerStyles, useCreatorCommentListStyle } from '../style/CreatorComment.style';
import CommentForm from '../sub/CommentForm';
import CommentItem from '../sub/CommentItem';
import CommentSortButtons, { CommentFilter, filters } from '../sub/CommentSortButtons';
import axios from '../../../../utils/axios';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import { isWithin24Hours } from '../creatorInfo/CreatorCommentList';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export interface StreamCommentListProps {
  streamId: string;
}

export default function StreamCommentList(props: StreamCommentListProps): JSX.Element {
  const { streamId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const listStyle = useCreatorCommentListStyle();
  const classes = useCommentContainerStyles();
  const authContext = useAuthContext();
  const [commentList, setCommentList] = useState<IStreamCommentData[]>([]);
  const [clickedFilterButtonIndex, setClickedFilterButtonIndex] = useState<number>(0); //  0 : 인기순(recommend), 1 : 최신순(date)
  const [{ data: commentData, loading }, getCommentData] = useAxios<IStreamCommentsRes>({
    url: `/streamComment/${streamId}`,
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
    const STREAM_COMMENT_REPORT_LIST_KEY = 'streamCommentReport';
    const reportList: {id: number, date: string, }[] = JSON.parse(localStorage.getItem(STREAM_COMMENT_REPORT_LIST_KEY) || '[]');
    const commentsRecentlyReported = reportList.filter((item) => isWithin24Hours(item.date));
    const commentIds = commentsRecentlyReported.map((item) => item.id);

    const currentCommentId = commentId;

    if (commentIds.includes(currentCommentId)) {
      ShowSnack('이미 신고한 댓글입니다', 'error', enqueueSnackbar);
      localStorage.setItem(STREAM_COMMENT_REPORT_LIST_KEY, JSON.stringify([...commentsRecentlyReported]));
      return new Promise((res, rej) => res(true));
    }
    // 현재  commentId가 로컬스토리지에 저장되어 있지 않다면 해당 글 신고하기 요청
    return axios.post(`/creatorComment/report/${commentId}`)
      .then((res) => {
        ShowSnack('댓글 신고 성공', 'info', enqueueSnackbar);
        localStorage.setItem(
          STREAM_COMMENT_REPORT_LIST_KEY,
          JSON.stringify([...commentsRecentlyReported, { id: currentCommentId, date: new Date() }]),
        );
        return new Promise((resolve, reject) => resolve(res));
      })
      .catch((err) => {
        ShowSnack('댓글 신고 오류', 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar]);

  const onClickLike = useCallback((commentId: number) => axios.post(
    `streamComment/vote/${commentId}`,
    { vote: 1, userId: authContext.user.userId || null },
  )
    .then((res) => {
      const result = res.data;
      return new Promise(((resolve, reject) => {
        resolve(result);
      }));
    })
    .catch((error) => console.error(error)), [authContext.user.userId]);

  const onClickHate = useCallback((commentId: number) => axios.post(
    `streamComment/vote/${commentId}`,
    { vote: 0, userId: authContext.user.userId || null },
  )
    .then((res) => {
      const result = res.data;
      return new Promise(((resolve, reject) => {
        resolve(result);
      }));
    })
    .catch((error) => console.error(error)), [authContext.user.userId]);

  const onDelete = useCallback((commentId: number) => (
    axios.delete(`/streamComment/${commentId}`)
      .then((res) => new Promise((resolve, reject) => resolve(res)))
      .catch((error) => console.error(error))
  ), []);

  const loadChildrenComments = useCallback((commentId: number) => axios.get(`streamComment/replies/${commentId}`)
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    }))
    .catch((error) => console.error(error)), []);

  const checkPasswordRequest = useCallback((commentId, password) => axios.post(`/streamComment/password/${commentId}`, { password })
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    })),
  []);
  return (
    <div className={classes.commentSectionWrapper}>
      <CommentForm
        postUrl={`/streamComment/${streamId}`}
        callback={reloadComments}
      />

      <div className={listStyle.commentsContainer}>
        <CommentSortButtons
          clickedButtonIndex={clickedFilterButtonIndex}
          handleRecommendFilter={handleRecommendFilter}
          handleDateFilter={handleDateFilter}
        />
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
                checkPasswordRequest={checkPasswordRequest}
                loadChildrenComments={loadChildrenComments}
                childrenCommentPostBaseUrl="/streamComment/replies"
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
