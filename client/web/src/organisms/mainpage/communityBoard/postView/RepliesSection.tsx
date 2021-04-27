import React, {
  useCallback,
} from 'react';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Paper, Typography,
} from '@material-ui/core';
import CommentItem from '../../ranking/sub/CommentItem';
import axios from '../../../../utils/axios';

interface SectionProps{
  totalReplyCount?: number,
  replies: CommunityReply[] | undefined,
  loadReplies: () => void
}

export interface ReplyState{
  replyId: number | null,
  action: 'edit'|'delete',
  callback?: null | (() => void)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  replyContainer: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  controls: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  popper: {
    padding: theme.spacing(2),
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
    '&>input': {
      width: theme.spacing(10),
      padding: theme.spacing(0.5),
    },
    '&>button': {
      minWidth: theme.spacing(6),
    },
  },
}));

/**
 * 댓글목록과 댓글 수정/삭제 버튼 눌렀을 때 뜨는 popper 관리하는 컴포넌트
 * @param props 
 */
export default function RepliesSection(props: SectionProps): JSX.Element {
  const classes = useStyles();
  const {
    totalReplyCount = 0,
    replies = [],
    loadReplies,
  } = props;

  const checkPasswordRequest = useCallback((replyId, password) => (
    axios.post(`/community/replies/${replyId}/password`, { password })
      .then((res) => new Promise((resolve, reject) => {
        resolve(res);
      }))
  ),
  []);

  const onDelete = useCallback((replyId: number) => (
    axios.delete(`community/replies/${replyId}`)
      .then((res) => new Promise((resolve, reject) => resolve(res)))
      .catch((error) => console.error(error))
  ), []);

  return (
    <section className={classes.replyContainer}>

      <div className={classes.controls}>
        <Typography>{`전체댓글 : ${totalReplyCount} 개`}</Typography>
      </div>

      <Paper>
        {/* 댓글목록 */}
        {replies.map((reply) => (
          <>
            <CommentItem
              key={reply.replyId}
              {...reply}
              commentId={reply.replyId}
              targetId={reply.postId}
              onDelete={onDelete}
              reloadComments={loadReplies}
              checkPasswordRequest={checkPasswordRequest}
            />
          </>
        ))}
      </Paper>

    </section>
  );
}
