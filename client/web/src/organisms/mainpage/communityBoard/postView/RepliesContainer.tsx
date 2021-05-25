import { Pagination } from '@material-ui/lab';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import React, { useEffect, useMemo } from 'react';
import { useStyles } from '../CommunityPostView';
import RepliesSection from './RepliesSection';
import CommentForm from '../../ranking/sub/CommentForm';

export interface RepliesContainerProps {
  replies: FindReplyResType | undefined,
  loadReplies: () => void,
  replyPage: number,
  replyCountPerPage: number,
  changeReplyPage: (event: React.ChangeEvent<unknown>, newPage: number) => void,
  postId: string,
  setReplyPage?: React.Dispatch<React.SetStateAction<number>>,
}

export default function RepliesContainer(props: RepliesContainerProps): JSX.Element {
  const {
    replies, loadReplies, replyPage,
    replyCountPerPage,
    changeReplyPage, postId,
    setReplyPage,
  } = props;
  const classes = useStyles();

  const replyPaginationCount = useMemo(() => {
    if (replies) {
      const childrenCommentTotal = replies.replies.reduce((childrenCount, reply) => (
        childrenCount + (reply.childrenCommentCount || 0)
      ), 0);
      const parentComments = replies.total - childrenCommentTotal;
      return Math.ceil(parentComments / replyCountPerPage);
    }
    return 1;
  }, [replies, replyCountPerPage]);

  // 댓글 2페이지에서 댓글 삭제시 댓글 1페이지로 이동시키기
  useEffect(() => {
    if (replyPage > 1 && replies?.replies.length === 0 && setReplyPage) {
      setReplyPage((prev) => prev - 1);
    }
  }, [replies, replyPage, setReplyPage]);

  return (
    <div className={classes.repliesContainer}>

      <RepliesSection
        totalReplyCount={replies ? replies.total : 0}
        replies={replies ? replies.replies : []}
        loadReplies={loadReplies}
      />
      <Pagination
        className={classes.replyPagenation}
        shape="rounded"
        page={replyPage}
        count={replyPaginationCount}
        onChange={changeReplyPage}
      />
      <CommentForm
        postUrl={`/community/posts/${postId}/replies`}
        callback={loadReplies}
      />

    </div>
  );
}
