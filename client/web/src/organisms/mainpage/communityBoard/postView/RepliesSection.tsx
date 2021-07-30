import React, {
  useCallback,
} from 'react';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Paper,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CommentItem from '../../ranking/sub/CommentItem';
import { isWithin24Hours } from '../../ranking/creatorInfo/CreatorCommentList';
import axios from '../../../../utils/axios';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useRemovePostComment from '../../../../utils/hooks/mutation/useRemovePostComment';

interface SectionProps{
  totalReplyCount?: number,
  replies: CommunityReply[] | undefined,
  postId: number,
  // loadReplies?: () => void
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
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    replies = [],
    postId,
  } = props;

  const checkPasswordRequest = useCallback((replyId, password) => (
    axios.post(`/community/replies/${replyId}/password`, { password })
      .then((res) => new Promise((resolve, reject) => {
        resolve(res);
      }))
  ),
  []);
  const { mutateAsync: deleteReply } = useRemovePostComment();
  const onDelete = useCallback((replyId: number) => (
    deleteReply({ replyId, postId })
      .then((res) => Promise.resolve(res))
      .catch((error) => console.error(error))
  ), [deleteReply, postId]);

  const onReport = useCallback((replyId: number) => {
    const BOARD_REPLY_REPORT_LIST_KEY = 'communityReplyReport';
    const reportList: {id: number, date: string, }[] = JSON.parse(localStorage.getItem(BOARD_REPLY_REPORT_LIST_KEY) || '[]');
    const commentsRecentlyReported = reportList.filter((item) => isWithin24Hours(item.date));
    const commentIds = commentsRecentlyReported.map((item) => item.id);

    const currentCommentId = replyId;

    if (commentIds.includes(currentCommentId)) {
      ShowSnack('이미 신고한 댓글입니다', 'error', enqueueSnackbar);
      localStorage.setItem(BOARD_REPLY_REPORT_LIST_KEY, JSON.stringify([...commentsRecentlyReported]));
      return new Promise((res, rej) => res(true));
    }
    // 현재  commentId가 로컬스토리지에 저장되어 있지 않다면 해당 글 신고하기 요청
    return axios.post(`/community/replies/report/${replyId}`)
      .then((res) => {
        localStorage.setItem(
          BOARD_REPLY_REPORT_LIST_KEY,
          JSON.stringify([...commentsRecentlyReported, { id: currentCommentId, date: new Date() }]),
        );
        return new Promise((resolve, reject) => resolve(res));
      })
      .catch((err) => {
        ShowSnack('댓글 신고 오류', 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [enqueueSnackbar]);

  const loadChildrenComments = useCallback((commentId: number) => axios.get(`/community/replies/child/${commentId}`)
    .then((res) => new Promise((resolve, reject) => {
      resolve(res);
    }))
    .catch((error) => console.error(error)), []);

  return (
    <section className={classes.replyContainer}>
      <Paper>
        {/* 댓글목록 */}
        {replies.map((reply) => (
          <CommentItem
            key={reply.replyId}
            idProperty="replyId"
            {...reply}
            deleteFlag={reply.deleteFlag ? 1 : 0}
            commentId={reply.replyId}
            targetId={reply.postId}
            onDelete={onDelete}
            onReport={onReport}
            childrenCount={reply.childrenCommentCount}
            checkPasswordRequest={checkPasswordRequest}
            loadChildrenComments={loadChildrenComments}
            childrenCommentPostBaseUrl="/community/replies/child"
          />
        ))}
      </Paper>

    </section>
  );
}
