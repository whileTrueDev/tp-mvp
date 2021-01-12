import React, { memo } from 'react';
import { Grid, Typography, Avatar } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CenterLoading from '../../atoms/Loading/CenterLoading';

const useCommentInfoStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    marginRight: theme.spacing(1),
  },
  nickname: {
    marginRight: theme.spacing(4),
  },
  commentText: {
    textAlign: 'start',
  },
}));

const CommentInfo = memo((props: Record<string, any>): JSX.Element => {
  const classes = useCommentInfoStyles();
  const { info } = props;
  const {
    profileImage, nickname, time, commentText,
  } = info;
  return (
    <Grid container direction="row">
      <Avatar className={classes.avatar} src={profileImage} alt={nickname} />
      <div>
        <Grid container>
          <Typography className={classes.nickname}>{nickname}</Typography>
          <Typography color="primary">{time}</Typography>
        </Grid>

        <Typography className={classes.commentText}>{commentText}</Typography>
      </div>
    </Grid>
  );
});

const commentTableColumns = [
  { field: 'date', title: '날짜', flex: 1 },
  { field: 'commentInfo', title: '', flex: 3 },
  {
    field: 'likes',
    title: () => (
      <>
        <ThumbUpIcon />
        &nbsp;좋아요
      </>
    ),
    flex: 1,
  },
  {
    field: 'hates',
    title: () => (
      <>
        <ThumbDownIcon />
        &nbsp;싫어요
      </>
    ),
    flex: 1,
  },
  { field: 'replies', title: '대댓글', flex: 1 },
];
interface fakeCommentType{
id: string;
date: string;
commentInfo: {
  profileImage: string;
  nickname: string;
  time: string;
  commentText: string;
};
likes: string;
 hates: string;
 replies: string;
}

interface proptype {
  commentsData: fakeCommentType[],
  loading: boolean,
}
const commonCellWidth = Object.fromEntries(commentTableColumns.map((c, i) => [`&>:nth-child(${i + 1})`, { flex: c.flex || 1 }]));

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    '&>*': {
      padding: theme.spacing(2),
      justifyContent: 'center',
    },
    ...commonCellWidth,
  },
  body: {
    position: 'relative',
  },
  row: {
    '&>*': {
      padding: theme.spacing(2),
      textAlign: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    ...commonCellWidth,
  },
  noDataText: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

export default function VideoAnalysisReactionTable(props: proptype): JSX.Element {
  const { commentsData, loading } = props;
  const classes = useStyles();

  return (
    <>
      <Grid className={classes.header} container>
        {
        commentTableColumns.map((col) => (
          <Grid container key={col.field}>
            {typeof col.title === 'string'
              ? col.title
              : col.title()}
          </Grid>
        ))
      }
      </Grid>
      <div className={classes.body}>
        {commentsData.length
          ? commentsData.map((data, index) => (
            <Grid className={classes.row} container key={data.id}>
              <Grid>{data.date}</Grid>
              <Grid>
                <CommentInfo info={data.commentInfo} />
              </Grid>
              <Grid>{data.likes}</Grid>
              <Grid>{data.hates}</Grid>
              <Grid>{data.replies}</Grid>
            </Grid>
          ))
          : <Typography className={classes.noDataText}>데이터가 없습니다</Typography>}
        {loading && <CenterLoading />}
      </div>
    </>
  );
}
