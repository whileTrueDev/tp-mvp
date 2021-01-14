import React, { memo } from 'react';
import {
  Grid, Typography, Avatar, Table, TableHead, TableBody, TableRow, TableCell,
} from '@material-ui/core';
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
  { field: 'date', title: '날짜' },
  { field: 'commentInfo', title: '' },
  {
    field: 'likes',
    title: () => (
      <>
        <ThumbUpIcon />
        &nbsp;좋아요
      </>
    ),

  },
  {
    field: 'hates',
    title: () => (
      <>
        <ThumbDownIcon />
        &nbsp;싫어요
      </>
    ),

  },
  { field: 'replies', title: '대댓글' },
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

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {

    backgroundColor: theme.palette.primary.light,
    '&>*': {
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(2),
      textAlign: 'center',
    },
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
    <Table>
      <TableHead>
        <TableRow className={classes.header}>
          {
        commentTableColumns.map((col) => (
          <TableCell key={col.field}>
            {typeof col.title === 'string'
              ? col.title
              : col.title()}
          </TableCell>
        ))
      }
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {commentsData.length
          ? commentsData.map((data, index) => (
            <TableRow className={classes.row} key={data.id}>
              <TableCell>{data.date}</TableCell>
              <TableCell>
                <CommentInfo info={data.commentInfo} />
              </TableCell>
              <TableCell>{data.likes}</TableCell>
              <TableCell>{data.hates}</TableCell>
              <TableCell>{data.replies}</TableCell>
            </TableRow>
          ))
          : <Typography className={classes.noDataText}>데이터가 없습니다</Typography>}
        {loading && <CenterLoading />}
      </TableBody>
    </Table>
  );
}
