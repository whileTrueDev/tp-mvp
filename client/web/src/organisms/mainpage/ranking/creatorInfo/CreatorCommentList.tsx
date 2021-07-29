import { Typography } from '@material-ui/core';
import React, {
  useCallback, useMemo, useState,
} from 'react';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import CommentItem from '../sub/CommentItem';
import { useCreatorCommentListStyle, useCommentContainerStyles } from '../style/CreatorComment.style';
import RegularButton from '../../../../atoms/Button/Button';
import CommentForm from '../sub/CommentForm';
import axios from '../../../../utils/axios';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import CommentSortButtons, { filters } from '../sub/CommentSortButtons';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import useCreatorCommentList from '../../../../utils/hooks/query/useCreatorCommentList';
import useMutateCreatorComment from '../../../../utils/hooks/mutation/useMutateCreatorComment';
import useRemoveCreatorComment from '../../../../utils/hooks/mutation/useRemoveCreatorComment';
import useMutateCreatorCommentVote from '../../../../utils/hooks/mutation/useMutateCreatorCommentVote';

export function isWithin24Hours(date: string): boolean {
  const now = dayjsFormatter();
  const targetDate = dayjsFormatter(date);
  return now.diff(targetDate, 'hour') < 24;
}

export interface CreatorCommentListProps{
  creatorId: string;
}

export default function CreatorCommentList(props: CreatorCommentListProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const listStyle = useCreatorCommentListStyle();
  const classes = useCommentContainerStyles();
  const { creatorId } = props;
  const queryClient = useQueryClient();
  const [clickedFilterButtonIndex, setClickedFilterButtonIndex] = useState<number>(0);
  //  0 : 인기순(recommend), 1 : 최신순(date)

  const { data: queryData, isFetching: loading, fetchNextPage } = useCreatorCommentList({
    creatorId,
    skip: 0,
    order: filters[clickedFilterButtonIndex],
  });
  // 댓글 데이터
  const data = useMemo(() => {
    const initialData = {
      comments: [],
      count: 0,
    };
    if (queryData) {
      return queryData.pages.reduce((total, currentPage) => ({
        comments: [...total.comments, ...currentPage.comments],
        count: currentPage.count,
      }), initialData);
    }
    return initialData;
  }, [queryData]);

  // 인기순 정렬 버튼 핸들러
  const handleRecommendFilter = useCallback(() => {
    setClickedFilterButtonIndex(0);
    queryClient.invalidateQueries(['creatorComment', { creatorId, order: 'recommend' }]);
  }, [creatorId, queryClient]);

  // 최신순 정렬 버튼 핸들러
  const handleDateFilter = useCallback(() => {
    setClickedFilterButtonIndex(1);
    queryClient.invalidateQueries(['creatorComment', { creatorId, order: 'date' }]);
  }, [creatorId, queryClient]);

  // 방송인 프로필 댓글 신고 버튼 핸들러
  const onReport = useCallback((commentId: number) => {
    const CREATOR_COMMENT_REPORT_LIST_KEY = 'cretorCommentReport';
    const reportList: {id: number, date: string, }[] = JSON.parse(localStorage.getItem(CREATOR_COMMENT_REPORT_LIST_KEY) || '[]');
    const commentsRecentlyReported = reportList.filter((item) => isWithin24Hours(item.date));
    const commentIds = commentsRecentlyReported.map((item) => item.id);

    const currentCommentId = commentId;

    if (commentIds.includes(currentCommentId)) {
      ShowSnack('이미 신고한 댓글입니다', 'error', enqueueSnackbar);
      localStorage.setItem(CREATOR_COMMENT_REPORT_LIST_KEY, JSON.stringify([...commentsRecentlyReported]));
      return Promise.resolve(true);
    }
    // 현재  commentId가 로컬스토리지에 저장되어 있지 않다면 해당 글 신고하기 요청
    return axios.post(`/creatorComment/report/${commentId}`)
      .then((res) => {
        ShowSnack('댓글 신고 성공', 'info', enqueueSnackbar);
        localStorage.setItem(
          CREATOR_COMMENT_REPORT_LIST_KEY,
          JSON.stringify([...commentsRecentlyReported, { id: currentCommentId, date: new Date() }]),
        );
        return Promise.resolve(res);
      })
      .catch((err) => {
        ShowSnack('댓글 신고 오류', 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar]);

  // 댓글 좋아요, 싫어요 요청
  const { mutateAsync: voteComment } = useMutateCreatorCommentVote();
  // 댓글 좋아요 요청 핸들러
  const onClickLike = useCallback(async (commentId: number) => {
    const result = await voteComment({ url: `creatorComment/vote/${commentId}`, vote: 1 });
    return Promise.resolve(result);
  }, [voteComment]);
  // 댓글 싫어요 요청 핸들러
  const onClickHate = useCallback(async (commentId: number) => {
    const result = await voteComment({ url: `creatorComment/vote/${commentId}`, vote: 0 });
    return Promise.resolve(result);
  }, [voteComment]);

  const loadChildrenComments = useCallback((commentId: number) => axios.get(`creatorComment/replies/${commentId}`)
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    }))
    .catch((error) => console.error(error)), []);

  // 방송인 프로필 페이지 댓글 비밀번호 확인 핸들러
  const checkPasswordRequest = useCallback((commentId, password) => axios.post(`/creatorComment/password/${commentId}`, { password })
    .then((res) => Promise.resolve(res)),
  []);

  // 방송인 프로필 페이지 댓글 생성 요청
  const { mutate: createComment } = useMutateCreatorComment();

  // 방송인 프로필 페이지 댓글 삭제 요청 핸들러
  const { mutateAsync: removeCreatorComment } = useRemoveCreatorComment();
  const onDelete = useCallback(async (commentId: number) => (
    removeCreatorComment({ commentId })
      .then((res) => Promise.resolve(res))
      .catch((error) => console.error(error))
  ), [removeCreatorComment]);

  return (
    <div className={classes.commentSectionWrapper}>
      <CommentForm
        postUrl={`/creatorComment/${creatorId}`}
        postRequest={createComment}
      />

      <div className={listStyle.commentsContainer}>
        <CommentSortButtons
          clickedButtonIndex={clickedFilterButtonIndex}
          handleRecommendFilter={handleRecommendFilter}
          handleDateFilter={handleDateFilter}
        />
        <div className={listStyle.commentListContainer}>
          {data.comments.length !== 0
            ? data.comments.map((d) => (
              <CommentItem
                key={d.commentId}
                {...d}
                targetId={d.commentId}
                onReport={onReport}
                onClickLike={onClickLike}
                onClickHate={onClickHate}
                onDelete={onDelete}
                checkPasswordRequest={checkPasswordRequest}
                loadChildrenComments={loadChildrenComments}
                childrenCommentPostBaseUrl="/creatorComment/replies"
              />
            ))
            : (
              <Typography className={listStyle.emptyList}>아직 댓글이 없어요! 첫 댓글을 남겨보세요.</Typography>
            )}
        </div>

      </div>

      <div className={listStyle.buttonWrapper}>
        {queryData
        && (data.count > data.comments.length)
        && <RegularButton onClick={() => fetchNextPage()} load={loading}>더보기</RegularButton>}
      </div>

    </div>
  );
}
