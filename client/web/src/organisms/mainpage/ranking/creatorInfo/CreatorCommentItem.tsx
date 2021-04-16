import {
  Avatar, Button, Typography,
} from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { ICreatorCommentData } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';
import axios from '../../../../utils/axios';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

export interface CreatorCommentItemProps extends ICreatorCommentData{
 /** 좋아요 눌렀는지 여부 */
 isLiked: boolean;
  /** 싫어요 눌렀는지 여부 */
 isHated: boolean;
 /** 추천많은 댓글인지 여부 */
 isBest?: boolean;
}

export default function CreatorCommentItem(props: CreatorCommentItemProps): JSX.Element {
  const authContext = useAuthContext();
  const classes = useCreatorCommentItemStyle();
  const {
    nickname,
    commentId,
    content, createDate, likesCount, hatesCount,
    profileImage,
    isHated = false,
    isLiked = false,
    userId, // 코멘트를 작성한 유저의 userId, undefined인 경우 비로그인하여 작성한 댓글
  } = props;

  const [likeClicked, setLikeClicked] = useState<boolean>(isLiked);
  const [hateClicked, setHateClicked] = useState<boolean>(isHated);
  const [likeNumber, setLikeNumber] = useState<number>(likesCount || 0);
  const [hateNumber, setHateNumber] = useState<number>(hatesCount || 0);

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
      setLikeNumber((prevLike) => prevLike - 1);
    }
    if (!likeClicked) {
      createLikeRequest();
      setLikeClicked(true);
      setLikeNumber((prevLike) => prevLike + 1);
    }
    if (hateClicked) {
      setHateClicked(false);
      setHateNumber((prevHate) => prevHate - 1);
      if (removeHateRequest) {
        removeHateRequest();
      }
    }
  }, [createLikeRequest, hateClicked, likeClicked, removeHateRequest, removeLikeRequest]);

  const clickHate = useCallback(() => {
    if (hateClicked) {
      removeHateRequest();
      setHateClicked(false);
      setHateNumber((prevHate) => prevHate - 1);
    }
    if (!hateClicked) {
      createHateRequest();
      setHateClicked(true);
      setHateNumber((prevHate) => prevHate + 1);
    }
    if (likeClicked) {
      setLikeClicked(false);
      setLikeNumber((prevLike) => prevLike - 1);
      if (removeLikeRequest) {
        removeLikeRequest();
      }
    }
  }, [createHateRequest, hateClicked, likeClicked, removeHateRequest, removeLikeRequest]);

  const deleteComment = useCallback(() => {
    // console.log(commentId, userId);
    if (authContext.user.userId && userId === authContext.user.userId) { // 로그인 되어 있는 경우 && 댓글작성자와 로그인유저가 동일한 경우
      // 댓글 삭제하시겠습니까 팝업
      // 확인 => 삭제, 취소 => 취소
    } else { // 댓글작성자와 로그인한 유저가 다른 경우, 로그인 하지 않은 경우
      // 비밀번호 확인 팝업
      // 비밀번호 맞으면 댓글 삭제하시겠습니까 팝업 
      // 비밀번호 틀리면 비밀번호 틀렸습니다 스낵바
    }
  }, [authContext.user.userId, commentId, userId]);

  const time = dayjs(createDate).format('YYYY-MM-DD HH:mm:ss');
  return (
    <div className={classes.commentItem}>

      <div className={classes.header}>
        <div className={classes.userInfo}>
          <Avatar component="span" className={classes.smallAvatar} src={profileImage} />
          <Typography component="span" className="nickname">{nickname}</Typography>
          {userId && <Typography component="span" className="userId">{`(${userId})`}</Typography>}
        </div>
        <div className={classes.headerActions}>
          {/* <Button
            aria-label="신고하기"
            className={classes.reportButton}
          >
            <img
              src="/images/rankingPage/reportIcon.png"
              srcSet="/images/rankingPage/reportIcon@2x.png 2x"
              alt="신고하기"
            />
          </Button> */}
          <Typography component="span" className="time" color="textSecondary">{time}</Typography>
          <Button className={classes.deleteButton} aria-label="삭제하기" onClick={deleteComment}>
            <CloseIcon className={classes.deleteButtonIconImage} />
          </Button>
        </div>

      </div>

      <Typography className={classes.content}>
        {content}
      </Typography>

      <div className={classes.actions}>
        {/* <div className={classes.nestedComments}>대댓글쓰기</div> */}
        <div className={classes.recommendIcons}>
          <Button
            onClick={clickLike}
            className={classnames(classes.actionButton, { [classes.liked]: likeClicked })}
            startIcon={<img width="36" height="36" src="/images/rankingPage/thumb_up.png" alt="추천" />}
          >
            <Typography
              component="span"
              className={classes.countText}
            >
              {likeNumber}
            </Typography>
          </Button>
          <Button
            onClick={clickHate}
            className={classnames(classes.actionButton, { [classes.hated]: hateClicked })}
            startIcon={<img width="36" height="36" src="/images/rankingPage/thumb_down.png" alt="비추천" />}
          >
            <Typography
              component="span"
              className={classes.countText}
            >
              {hateNumber}
            </Typography>
          </Button>
        </div>

      </div>
    </div>
  );
}
