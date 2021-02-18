import { ListItem, Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ko } from 'date-fns/locale';
import * as dateFns from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';

const usePostItemStyles = makeStyles((theme: Theme) => createStyles({
  postNumber: { width: '5%', textAlign: 'center' },
  title: {
    width: ' 50%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  writer: { width: '20%', textAlign: 'center' },
  date: { width: '15%', textAlign: 'center' },
  hit: { width: '5%', textAlign: 'center' },
  recommend: { width: '5%', textAlign: 'center' },
}));
interface PostItemProps{
  post: PostFound;
}

function PostItem({
  post,
}: PostItemProps): JSX.Element {
  const classes = usePostItemStyles();
  const {
    // postId,
    // platform,
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
  const userDisplay = (
    <>
      <span>{nickname}</span>
      <span>{ipText}</span>
    </>
  );
  const titleDisplay = `${title}${replies > 0 ? `[${replies}]` : ''}`;
  return (
    <ListItem
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
