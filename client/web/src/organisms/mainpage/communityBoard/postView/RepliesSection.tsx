import React from 'react';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Divider, Paper, Typography, IconButton, TextField,
} from '@material-ui/core';
import * as dateFns from 'date-fns';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useReplyItemStyle = makeStyles((theme: Theme) => createStyles({
  replyItem: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      wordBreak: 'break-all',
      padding: theme.spacing(1),

    },
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  nickname: {
    width: '20%',
    color: theme.palette.grey[700],
  },
  content: {
    width: '50%',
  },
  date: {
    width: '15%',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '15%',
  },
}));

function ReplyItem({ reply }: {reply: CommunityReply}): JSX.Element {
  const classes = useReplyItemStyle();
  const {
    replyId, content, nickname, ip, createDate,
  } = reply;
  return (
    <div className={classes.replyItem}>
      <Typography className={classes.nickname}>{`${nickname}(${ip})`}</Typography>
      <Typography className={classes.content}>{content}</Typography>
      <Typography variant="caption" className={classes.date}>{dateFns.format(new Date(createDate), 'yy-mm-dd hh:MM:ss')}</Typography>
      <div className={classes.actions}>
        <IconButton aria-label="수정"><EditIcon /></IconButton>
        <IconButton aria-label="삭제"><HighlightOffIcon /></IconButton>
      </div>

    </div>
  );
}
interface SectionProps{
  className?: string,
  totalReplyCount?: number,
  replies: CommunityReply[] | undefined
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  replyContainer: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  controls: {
    display: 'flex',
  },
}));

export default function RepliesSection(props: SectionProps): JSX.Element {
  const {
    totalReplyCount = 0,
    replies = [],
  } = props;
  const classes = useStyles();
  return (
    <section className={classes.replyContainer}>

      {/* 여러가지 버튼 */}
      <div className={classes.controls}>
        <Typography>{`전체댓글 :${totalReplyCount}`}</Typography>
        <button>오래된 댓글부터 보기</button>
        <button>최근 등록된 댓글부터 보기</button>
        <div>
          <button>본문보기</button>
          <button>댓글닫기</button>
          <button>새고로침</button>
        </div>
      </div>
      <Divider />

      <Paper>
        {/* 댓글목록 */}
        {replies.map((reply) => <ReplyItem key={reply.replyId} reply={reply} />)}
        {/* <div>댓글 페이지네이션</div> */}
      </Paper>
      {replies.length ? <Divider /> : null}
    </section>
  );
}
