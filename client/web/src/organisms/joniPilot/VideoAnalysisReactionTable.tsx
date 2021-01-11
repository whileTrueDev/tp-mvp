import React, { memo } from 'react';
import { Grid, Typography, Avatar } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';

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
const CommentInner = memo((prop: Record<string, any>) => {
  const classes = useCommentInfoStyles();
  const { commentInfo } = prop;
  return (
    <>
      <Grid container>
        <Avatar className={classes.avatar} src={commentInfo.profileImage} alt={commentInfo.nickname} />
        <div>
          <Grid container>
            <Typography className={classes.nickname}>{commentInfo.nickname}</Typography>
            <Typography color="primary">{commentInfo.time}</Typography>
          </Grid>

          <Typography className={classes.commentText}>{commentInfo.commentText}</Typography>
        </div>
      </Grid>
    </>
  );
});

const testRender = (rowData: Record<string, any>): JSX.Element => {
  const { commentInfo } = rowData;
  return (
    <CommentInner commentInfo={commentInfo} />
  );
};

const commentTableColumns = [
  { field: 'date', title: '날짜', textAlign: 'center' },
  {
    field: 'commentInfo',
    title: '',
    textAlign: 'center',
    render: function CommentInfo(rowData: Record<string, any>) {
      const { commentInfo } = rowData;
      return (
        <CommentInner commentInfo={commentInfo} />
      );
    },
  },
  { field: 'likes', title: '좋아요', textAlign: 'center' },
  { field: 'hates', title: '싫어요', textAlign: 'center' },
  { field: 'replies', title: '대댓글', textAlign: 'center' },
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
  commentsData: fakeCommentType[]
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    backgroundColor: theme.palette.primary.light,
    '&>*': {
      flex: 1,
    },
  },
  row: {
    '&>*': {
      flex: 1,
    },
  },
}));
export default function VideoAnalysisReactionTable(props: proptype): JSX.Element {
  const { commentsData } = props;
  const classes = useStyles();
  return (
    <>
      <Grid className={classes.header} container>
        {
        commentTableColumns.map((col) => (
          <Grid item key={col.field}>
            {col.title}
          </Grid>
        ))
      }
      </Grid>
      <div className="body">
        {commentsData.map((data) => (
          <Grid className={classes.row} container key={data.id}>
            <Grid>{data.date}</Grid>
            <Grid>
              {testRender(data)}
            </Grid>
            <Grid>{data.likes}</Grid>
            <Grid>{data.hates}</Grid>
            <Grid>{data.replies}</Grid>
          </Grid>
        ))}
      </div>
    </>
  );
}
