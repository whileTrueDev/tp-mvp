import { Button, Typography } from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ko from 'dayjs/locale/ko';
import classnames from 'classnames';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';

dayjs.locale(ko);
dayjs.extend(relativeTime);
export interface CreatorCommentItemProps {
 commentId: number;
 /** 코멘트가 달린 크리에이터 아이디 */
 creatorId: string;
 /** 코멘트 작성한 유저의 아이디 */
 userId?: string | null;
 /** 코멘트 작성한 유저가 입력한 닉네임 */
 nickname: string;
 content: string;
 createDate: Date;
 /** 코멘트 좋아요 횟수 */
 likesCount: number;
 /** 코멘트 싫어요 횟수 */
 hatesCount: number;

 /** 좋아요 눌렀는지 여부 */
 isLiked: boolean;
  /** 싫어요 눌렀는지 여부 */
 isHated: boolean;

 likeHandler?: () => void;
 hateHandler?: () => void;
}

export default function CreatorCommentItem(props: CreatorCommentItemProps): JSX.Element {
  const classes = useCreatorCommentItemStyle();
  const {
    nickname,
    content, createDate, likesCount, hatesCount,
    likeHandler, hateHandler,
    isHated = false,
    isLiked = false,
  } = props;

  const [likeClicked, setLikeClicked] = useState<boolean>(isLiked);
  const [hateClicked, setHateClicked] = useState<boolean>(isHated);
  const [likeDisplay, setLikeDisplay] = useState<number>(likesCount);
  const [hateDisplay, setHateDisplay] = useState<number>(hatesCount);

  const clickLike = useCallback(() => {
    setLikeClicked((prev) => !prev);
    setLikeDisplay((prevLike) => (likeClicked ? prevLike - 1 : prevLike + 1));
    if (hateClicked) {
      setHateClicked(false);
      setHateDisplay((prevHate) => prevHate - 1);
    }
    if (likeHandler) {
      likeHandler();
    }
  }, [hateClicked, likeClicked, likeHandler]);
  const clickHate = useCallback(() => {
    setHateClicked((prev) => !prev);
    setHateDisplay((prevHate) => (hateClicked ? prevHate - 1 : prevHate + 1));
    if (likeClicked) {
      setLikeClicked(false);
      setLikeDisplay((prevLike) => prevLike - 1);
    }
    if (hateHandler) {
      hateHandler();
    }
  }, [hateClicked, hateHandler, likeClicked]);
  return (
    <div className={classes.commentItem}>
      <div className={classes.header}>
        <Typography component="span" className="nickname">{nickname}</Typography>
        <Typography component="span" className="time">{dayjs(createDate).fromNow()}</Typography>
      </div>
      <div className={classes.content}>
        {content}
      </div>
      <div className={classes.actions}>
        <Button
          onClick={clickLike}
          className={classnames({ [classes.liked]: likeClicked })}
        >
          <ThumbUpIcon />
          <Typography
            component="span"
            className={classes.countText}
          >
            {likeDisplay}
          </Typography>
        </Button>
        <Button
          onClick={clickHate}
          className={classnames({ [classes.hated]: hateClicked })}
        >
          <ThumbDownIcon />
          <Typography
            component="span"
            className={classes.countText}
          >
            {hateDisplay}
          </Typography>
        </Button>
      </div>
    </div>
  );
}
