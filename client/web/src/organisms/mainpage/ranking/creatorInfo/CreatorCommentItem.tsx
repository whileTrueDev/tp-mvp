import { Button, Chip, Typography } from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ko from 'dayjs/locale/ko';
import classnames from 'classnames';
import { ICreatorCommentData } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';
import axios from '../../../../utils/axios';

dayjs.locale(ko);
dayjs.extend(relativeTime);
export interface CreatorCommentItemProps extends ICreatorCommentData{
 /** 좋아요 눌렀는지 여부 */
 isLiked: boolean;
  /** 싫어요 눌렀는지 여부 */
 isHated: boolean;
 /** 추천많은 댓글인지 여부 */
 isBest?: boolean;
}

export default function CreatorCommentItem(props: CreatorCommentItemProps): JSX.Element {
  const classes = useCreatorCommentItemStyle();
  const {
    nickname,
    commentId,
    content, createDate, likesCount, hatesCount,
    isHated = false,
    isLiked = false,
    isBest = false,
  } = props;

  const [likeClicked, setLikeClicked] = useState<boolean>(isLiked);
  const [hateClicked, setHateClicked] = useState<boolean>(isHated);
  const [likeDisplay, setLikeDisplay] = useState<number>(likesCount || 0);
  const [hateDisplay, setHateDisplay] = useState<number>(hatesCount || 0);

  const createLikeRequest = useCallback(() => axios.post(`creatorComment/like/${commentId}`)
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [commentId]);
  const removeLikeRequest = useCallback(() => axios.delete(`creatorComment/like/${commentId}`)
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [commentId]);
  const createHateRequest = useCallback(() => axios.post(`creatorComment/hate/${commentId}`)
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [commentId]);
  const removeHateRequest = useCallback(() => axios.delete(`creatorComment/hate/${commentId}`)
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [commentId]);

  const clickLike = useCallback(() => {
    if (likeClicked) {
      removeLikeRequest();
      setLikeClicked(false);
      setLikeDisplay((prevLike) => prevLike - 1);
    }
    if (!likeClicked) {
      createLikeRequest();
      setLikeClicked(true);
      setLikeDisplay((prevLike) => prevLike + 1);
    }
    if (hateClicked) {
      setHateClicked(false);
      setHateDisplay((prevHate) => prevHate - 1);
      if (removeHateRequest) {
        removeHateRequest();
      }
    }
  }, [createLikeRequest, hateClicked, likeClicked, removeHateRequest, removeLikeRequest]);

  const clickHate = useCallback(() => {
    if (hateClicked) {
      removeHateRequest();
      setHateClicked(false);
      setHateDisplay((prevHate) => prevHate - 1);
    }
    if (!hateClicked) {
      createHateRequest();
      setHateClicked(true);
      setHateDisplay((prevHate) => prevHate + 1);
    }
    if (likeClicked) {
      setLikeClicked(false);
      setLikeDisplay((prevLike) => prevLike - 1);
      if (removeLikeRequest) {
        removeLikeRequest();
      }
    }
  }, [createHateRequest, hateClicked, likeClicked, removeHateRequest, removeLikeRequest]);
  return (
    <div className={classes.commentItem}>
      <div className={classes.header}>
        {isBest && <Chip label="★Best" color="secondary" />}
        <Typography component="span" className="nickname">{nickname}</Typography>
        <Typography component="span" className="time">{dayjs(createDate).fromNow()}</Typography>
      </div>
      <div className={classes.content}>
        {content}
      </div>
      <div className={classes.actions}>
        <Button
          onClick={clickLike}
          className={classnames(classes.actionButton, { [classes.liked]: likeClicked })}
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
          className={classnames(classes.actionButton, { [classes.hated]: hateClicked })}
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
