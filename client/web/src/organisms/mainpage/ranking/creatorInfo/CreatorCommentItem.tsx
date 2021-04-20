import {
  Avatar, Button, Typography,
} from '@material-ui/core';
import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { ICreatorCommentData } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import ReplyIcon from '@material-ui/icons/Reply';
import { useSnackbar } from 'notistack';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';
import axios from '../../../../utils/axios';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import CommentForm from '../sub/CommentForm';
import useToggle from '../../../../utils/hooks/useToggle';
import CustomDialog from '../../../../atoms/Dialog/Dialog';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

export interface CreatorCommentItemProps extends ICreatorCommentData{
 /** 좋아요 눌렀는지 여부 */
 isLiked: boolean;
  /** 싫어요 눌렀는지 여부 */
 isHated: boolean;
 /** 추천많은 댓글인지 여부 */
 isBest?: boolean;
 /** 자식댓글 (대댓글) 인지 여부 */
 isChildComment?: boolean;

 /** 댓글 삭제 후 전체 댓글 다시 불러오는 함수 */
 reloadComments? : () => void;
}

export function isReportedIn24Hours(date: string): boolean {
  const now = dayjs();
  const targetDate = dayjs(date);
  return now.diff(targetDate, 'hour') < 24;
}

export default function CreatorCommentItem(props: CreatorCommentItemProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const authContext = useAuthContext();
  const classes = useCreatorCommentItemStyle();
  const {
    nickname,
    commentId,
    content, createDate, likesCount, hatesCount, childrenCommentCount,
    profileImage,
    reloadComments,
    isHated = false,
    isLiked = false,
    isChildComment = false,
    userId, // 코멘트를 작성한 유저의 userId, undefined인 경우 비로그인하여 작성한 댓글
  } = props;

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const [likeClicked, setLikeClicked] = useState<boolean>(isLiked);
  const [hateClicked, setHateClicked] = useState<boolean>(isHated);
  const [likeNumber, setLikeNumber] = useState<number>(likesCount || 0);
  const [hateNumber, setHateNumber] = useState<number>(hatesCount || 0);

  const { toggle: commentFormOpen, handleToggle: handleCommentFormOpen } = useToggle();
  const { toggle: replyListOpen, handleToggle: handleReplyListOpen } = useToggle();

  const [replies, setReplies] = useState<ICreatorCommentData[]>([]);
  const [repliesCount, setRepliesCount] = useState<number>(childrenCommentCount || 0);

  useEffect(() => {
    setRepliesCount(repliesCount || 0);
  }, [repliesCount]);

  const createLikeRequest = useCallback(() => axios.post(`creatorComment/like/${commentId}`, { userId: authContext.user.userId })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [authContext.user.userId, commentId]);
  const removeLikeRequest = useCallback(() => axios.delete(`creatorComment/like/${commentId}`, { data: { userId: authContext.user.userId } })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [authContext.user.userId, commentId]);
  const createHateRequest = useCallback(() => axios.post(`creatorComment/hate/${commentId}`, { userId: authContext.user.userId })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [authContext.user.userId, commentId]);
  const removeHateRequest = useCallback(() => axios.delete(`creatorComment/hate/${commentId}`, { data: { userId: authContext.user.userId } })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
      }
    }), [authContext.user.userId, commentId]);

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
    }
  }, [createLikeRequest, hateClicked, likeClicked, removeLikeRequest]);

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
    }
  }, [createHateRequest, hateClicked, likeClicked, removeHateRequest]);

  const handleDeleteButton = useCallback(() => {
    // console.log(commentId, userId);
    if (authContext.user.userId && userId === authContext.user.userId) {
      // 로그인 되어 있는 경우 && 댓글작성자와 로그인유저가 동일한 경우
      // 댓글 삭제하시겠습니까 팝업
      setConfirmDialogOpen(true);
      // 확인 => 삭제, 취소 => 취소
    } else {
      // 댓글작성자와 로그인한 유저가 다른 경우, 로그인 하지 않은 경우
      setPasswordDialogOpen(true);
      // 비밀번호 확인 팝업
      // 비밀번호 맞으면 댓글 삭제하시겠습니까 팝업 
      // 비밀번호 틀리면 비밀번호 틀렸습니다 스낵바
    }
  }, [authContext.user.userId, userId]);

  const openCommentWriteForm = useCallback(() => {
    handleCommentFormOpen();
  }, [handleCommentFormOpen]);

  const getRepliesRequest = useCallback(() => {
    axios.get(`creatorComment/replies/${commentId}`)
      .then((res) => {
        setReplies(res.data);
        setRepliesCount(res.data.length);
      })
      .catch((error) => console.error(error));
  }, [commentId]);

  const openReplyList = useCallback(() => {
    handleReplyListOpen();
    // 대댓글 목록이 닫혀있고, 대댓글 개수가 0이 아니면서 불러온 대댓글 목록이 없을 때 대댓글 목록 요청하기
    if (!replyListOpen && repliesCount !== 0 && replies.length === 0) {
      getRepliesRequest();
    }
  }, [getRepliesRequest, handleReplyListOpen, replies.length, repliesCount, replyListOpen]);

  const replySubmitCallback = useCallback(() => {
    // 대댓글 생성 요청 성공 후 실행할 일들
    getRepliesRequest();// 대댓글 다시 불러오기,
    handleCommentFormOpen();// 대댓글 작성폼 닫기
    if (!replyListOpen) { // 대댓글 목록 열려있지 않으면 열기
      handleReplyListOpen();
    }
  }, [getRepliesRequest, handleCommentFormOpen, handleReplyListOpen, replyListOpen]);

  const checkPasswordBeforeDelete = () => {
    // 비밀번호 input 값 받아서 비밀번호 확인 요청,
    if (!passwordInputRef.current) {
      return;
    }
    const password = passwordInputRef.current.value;
    if (password.trim().length === 0) {
      ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
      passwordInputRef.current.value = '';
      return;
    }

    axios.post(`/creatorComment/password/${commentId}`, { password })
      .then((res) => {
        const passwordMatch: boolean = res.data;
        if (passwordMatch) {
          setPasswordDialogOpen(false);
          setConfirmDialogOpen(true);
        } else {
          ShowSnack('비밀번호가 틀렸습니다. 다시 확인해주세요', 'error', enqueueSnackbar);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteComment = () => {
    axios.delete(`/creatorComment/${commentId}`)
      .then((res) => {
        if (reloadComments) {
          reloadComments();
        }
        setConfirmDialogOpen(false);
      })
      .catch((error) => console.error(error));
  };

  const report = useCallback(() => {
    const reportList: {id: number, date: string}[] = JSON.parse(localStorage.getItem('reportList') || '[]');
    const commentsRecentlyReported = reportList.filter((item) => isReportedIn24Hours(item.date));
    const commentIds = commentsRecentlyReported.map((item) => item.id);

    const currentCommentId = commentId;

    if (commentIds.includes(currentCommentId)) {
      ShowSnack('이미 신고한 댓글입니다', 'error', enqueueSnackbar);
      localStorage.setItem('reportList', JSON.stringify([...commentsRecentlyReported]));
      return;
    }
    // 현재  commentId가 로컬스토리지에 저장되어 있지 않다면 해당 글 신고하기 요청
    axios.post(`/creatorComment/report/${commentId}`)
      .then((res) => {
        localStorage.setItem('reportList', JSON.stringify([...commentsRecentlyReported, { id: currentCommentId, date: new Date() }]));
      })
      .catch((err) => {
        ShowSnack('댓글 신고 오류', 'error', enqueueSnackbar);
        console.error(err);
      });
  }, [commentId, enqueueSnackbar]);

  const time = dayjs(createDate).format('YYYY-MM-DD HH:mm:ss');
  return (
    <div className={classnames(classes.commentItem, { child: isChildComment })}>
      <div className={classes.header}>
        <div className={classes.userInfo}>
          <Avatar component="span" className={classes.smallAvatar} src={profileImage} />
          <Typography component="span" className="nickname">{nickname}</Typography>
          {userId && <Typography component="span" className="userId">{`(${userId})`}</Typography>}
        </div>
        <div className={classes.headerActions}>
          <Button
            aria-label="신고하기"
            className={classes.reportButton}
            onClick={report}
          >
            <img
              src="/images/rankingPage/reportIcon.png"
              srcSet="/images/rankingPage/reportIcon@2x.png 2x"
              alt="신고하기"
            />
          </Button>
          <Typography component="span" className="time" color="textSecondary">{time}</Typography>
          <Button className={classes.deleteButton} aria-label="삭제하기" onClick={handleDeleteButton}>
            <CloseIcon className={classes.deleteButtonIconImage} />
          </Button>
        </div>
      </div>

      <Typography className={classes.content}>
        {content}
      </Typography>

      <div className={classes.actions}>

        {!isChildComment && (
          <div className={classes.nestedComments}>
            <Button
              onClick={openCommentWriteForm}
              startIcon={<ReplyIcon className={classes.replyIcon} />}
            >
              대댓글쓰기
            </Button>
            <Button onClick={openReplyList}>{`댓글 ${repliesCount}개`}</Button>
          </div>
        )}

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

      {!isChildComment && (
        <>
          <div className={classnames(classes.commentFormContainer, { open: commentFormOpen })}>
            <CommentForm
              postUrl={`/creatorComment/replies/${commentId}`}
              submitSuccessCallback={replySubmitCallback}
            />
          </div>
          <div className={classnames(classes.replyList, { open: replyListOpen })}>
            {
              (replies.length > 0) && (
                replies.map((reply) => (
                  <CreatorCommentItem
                    key={reply.commentId}
                    {...reply}
                    isChildComment
                    reloadComments={getRepliesRequest}
                    isLiked={false}
                    isHated={false}
                  />
                ))
              )
            }
          </div>
        </>
      )}

      <CustomDialog
        open={passwordDialogOpen}
        onClose={() => {
          if (passwordInputRef.current) {
            passwordInputRef.current.value = '';
          }
          setPasswordDialogOpen(false);
        }}
        title="비밀번호 확인"
        callback={checkPasswordBeforeDelete}
      >
        <Typography>비밀번호를 입력해주세요</Typography>
        <input ref={passwordInputRef} />
      </CustomDialog>

      <CustomDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
        }}
        title="댓글 삭제"
        callback={deleteComment}
      >
        <Typography>정말로 삭제하시겠습니까?</Typography>
      </CustomDialog>
    </div>
  );
}
