import {ListItem, Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import { ko } from "date-fns/locale";
import * as dateFns from 'date-fns';
import React from "react";
import {useHistory} from 'react-router-dom';



const usePostItemStyles = makeStyles((theme: Theme) => createStyles({
  numbering: { width: '5%', textAlign: 'center' },
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
  post: any;
  numbering: number;
}

function PostItem({
  post,
  numbering,
}: PostItemProps): JSX.Element {
  const classes = usePostItemStyles();
  const {
    postId, title, nickname, ip, createDate,
    platform, category, hit, recommend, replies,
  } = post;
  const history = useHistory();

  let dateDisplay: string;
  const date = new Date(createDate);
  if (date.getDate() === new Date().getDate()) {
    // 오늘 날짜인 경우
    dateDisplay = `${dateFns.formatDistanceToNow(date, { locale: ko })} 전`;
  } else {
    dateDisplay = dateFns.format(date, 'yyyy-MM-dd');
  }

  const ipText = category === 0 ? ` (${ip})`: '';// category===0 일반글인 경우만 ip보이게
  const userDisplay = <><span>{nickname}</span><span>{ipText}</span></>; 
  const titleDisplay = `${title}${replies > 0 ? `[${replies}]` : ''}`;
  return (
    <ListItem
      button
      onClick={() => {
        // 개별글 보기로 이동
        console.log(post);
        history.push(`/community-board/view/${post.postId}`);
      }}
    >
      <Typography className={classes.numbering}>{numbering}</Typography>
      <Typography className={classes.title}>{titleDisplay}</Typography>
      <Typography className={classes.writer}>{userDisplay}</Typography>
      <Typography className={classes.date}>{dateDisplay}</Typography>
      <Typography className={classes.hit}>{hit}</Typography>
      <Typography className={classes.recommend}>{recommend}</Typography>
    </ListItem>
  );
}

export default PostItem;