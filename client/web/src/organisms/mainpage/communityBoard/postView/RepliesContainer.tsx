import { Pagination } from '@material-ui/lab';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import React from 'react';
import { useStyles } from '../CommunityPostView';
import RepliesSection from './RepliesSection';
import CommentForm from '../../ranking/sub/CommentForm';

export interface RepliesContainerProps {
  replies: FindReplyResType | undefined,
  loadReplies: () => void,
  replyPage: number,
  replyPaginationCount: number,
  changeReplyPage: (event: React.ChangeEvent<unknown>, newPage: number) => void,
  postId: string,
}

export default function RepliesContainer(props: RepliesContainerProps): JSX.Element {
  const {
    replies, loadReplies, replyPage, replyPaginationCount, changeReplyPage, postId,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.repliesContainer}>
      <CommentForm
        postUrl={`/community/posts/${postId}/replies`}
        callback={loadReplies}
      />

      <RepliesSection
        totalReplyCount={replies ? replies.total : 0}
        replies={replies ? replies.replies : []}
        loadReplies={loadReplies}
      />

      { replyPaginationCount > 1
        ? (
          <Pagination
            className={classes.replyPagenation}
            shape="rounded"
            page={replyPage}
            count={replyPaginationCount}
            onChange={changeReplyPage}
          />
        )
        : null}

    </div>
  );
}
