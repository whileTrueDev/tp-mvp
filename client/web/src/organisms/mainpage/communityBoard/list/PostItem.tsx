import { ListItem, Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ko } from 'date-fns/locale';
import * as dateFns from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';

const usePostItemStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '64px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&>*': {
      height: '100%',
      textAlign: 'center',
      margin: theme.spacing(1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  postNumber: {
    width: '5%',
  },
  title: {
    width: ' 50%',
    whiteSpace: 'pre-line',
    textAlign: 'start',
  },
  writer: {
    width: '20%',
    whiteSpace: 'pre-line',
    textAlign: 'start',
  },
  date: {
    width: '15%',
  },
  hit: {
    width: '5%',
  },
  recommend: {
    width: '5%',
  },
}));
type PostItemProps = {
  post: PostFound,
  widths: string[],
}

function PostItem({
  post, widths,
}: PostItemProps): JSX.Element {
  const classes = usePostItemStyles();
  const {
    title, nickname, ip, createDate,
    category, hit, recommend, replies,
    postNumber,
  } = post;
  const history = useHistory();

  let dateDisplay: string;
  if (createDate) {
    const date = new Date(createDate);
    if (date.getDate() === new Date().getDate()) {
      // 오늘 날짜인 경우
      dateDisplay = `${dateFns.formatDistanceToNow(date, { locale: ko })} 전`;
    } else {
      dateDisplay = dateFns.format(date, 'MM-dd');
    }
  } else {
    dateDisplay = '';
  }

  const ipText = category === 0 ? ` (${ip})` : '';// category===0 일반글인 경우만 ip보이게
  const userDisplay = `${nickname}${ipText}`;
  const titleDisplay = `${title}${replies > 0 ? `[${replies}]` : ''}`;
  return (
    <ListItem
      className={classes.root}
      button
      onClick={() => {
        // 개별글 보기로 이동
        // console.log(post);
        history.push(`/community-board/view/${post.postId}`);
      }}
    >
      <Typography className={classes.postNumber}>{postNumber}</Typography>
      <Typography className={classes.title}>{titleDisplay}</Typography>
      <Typography className={classes.writer}>{userDisplay}</Typography>
      <Typography className={classes.date}>{dateDisplay}</Typography>
      <Typography className={classes.hit}>{hit}</Typography>
      <Typography className={classes.recommend}>{recommend}</Typography>
    </ListItem>
  );
}

export default PostItem;
