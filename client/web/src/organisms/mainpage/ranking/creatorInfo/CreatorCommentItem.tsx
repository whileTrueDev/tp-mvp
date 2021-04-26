import {
  Avatar, Button, Typography,
} from '@material-ui/core';
import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { ICreatorCommentData } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import ReplyIcon from '@material-ui/icons/Reply';
import { useSnackbar } from 'notistack';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';
import axios from '../../../../utils/axios';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import useDialog from '../../../../utils/hooks/useDialog';
import CommentForm from '../sub/CommentForm';
import useToggle from '../../../../utils/hooks/useToggle';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import DeleteButton from '../sub/DeleteButton';
import PasswordConfirmDialog from '../sub/PasswordConfirmDialog';
import DeleteConfirmDialog from '../sub/DeleteConfirmDialog';

export interface CreatorCommentItemProps extends ICreatorCommentData{
 /** 좋아요 눌렀는지 여부 */
 isLiked?: boolean;
  /** 싫어요 눌렀는지 여부 */
 isHated?: boolean;
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
    content, createDate, likesCount, hatesCount,
    childrenCount = 0,
    profileImage,
    reloadComments,
    isHated = false,
    isLiked = false,
    isChildComment = false,
    userId, // 코멘트를 작성한 유저의 userId, undefined인 경우 비로그인하여 작성한 댓글
  } = props;

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { open: passwordDialogOpen, handleOpen: openPasswordDialog, handleClose: closePasswordDialog } = useDialog();
  const { open: confirmDialogOpen, handleOpen: openConfirmDialog, handleClose: closeConfirmDialog } = useDialog();

  const [likeClicked, setLikeClicked] = useState<boolean>(isLiked);
  const [hateClicked, setHateClicked] = useState<boolean>(isHated);
  const [likeNumber, setLikeNumber] = useState<number>(likesCount || 0);
  const [hateNumber, setHateNumber] = useState<number>(hatesCount || 0);

  const { toggle: commentFormOpen, handleToggle: handleCommentFormOpen } = useToggle();
  const { toggle: replyListOpen, handleToggle: handleReplyListOpen } = useToggle();

  const [replies, setReplies] = useState<ICreatorCommentData[]>([]);
  const [repliesCount, setRepliesCount] = useState<number>(childrenCount);

  useEffect(() => {
    setRepliesCount(repliesCount || 0);
  }, [repliesCount]);

  const handleVoteResult = useCallback((result: {like: number, hate: number}): void => {
    setLikeClicked(result.like === 1);
    setHateClicked(result.hate === 1);
    if (result.like !== 0) {
      setLikeNumber((prev) => prev + result.like);
    }
    if (result.hate !== 0) {
      setHateNumber((prev) => prev + result.hate);
    }
  }, []);

  const clickLike = useCallback(() => {
    axios.post(`creatorComment/vote/${commentId}`, { vote: 1, userId: authContext.user.userId })
      .then((res) => {
        const result = res.data;
        handleVoteResult(result);
      })
      .catch((error) => console.error(error));
  }, [authContext.user.userId, commentId, handleVoteResult]);

  const clickHate = useCallback(() => {
    axios.post(`creatorComment/vote/${commentId}`, { vote: 0, userId: authContext.user.userId })
      .then((res) => {
        const result = res.data;
        handleVoteResult(result);
      })
      .catch((error) => console.error(error));
  }, [authContext.user.userId, commentId, handleVoteResult]);

  const handleDeleteButton = useCallback(() => {
    // console.log(commentId, userId);
    if (authContext.user.userId && userId === authContext.user.userId) {
      // 로그인 되어 있는 경우 && 댓글작성자와 로그인유저가 동일한 경우
      // 댓글 삭제하시겠습니까 팝업
      openConfirmDialog();
      // 확인 => 삭제, 취소 => 취소
    } else {
      // 댓글작성자와 로그인한 유저가 다른 경우, 로그인 하지 않은 경우
      openPasswordDialog();
      // 비밀번호 확인 팝업
      // 비밀번호 맞으면 댓글 삭제하시겠습니까 팝업 
      // 비밀번호 틀리면 비밀번호 틀렸습니다 스낵바
    }
  }, [authContext.user.userId, openConfirmDialog, openPasswordDialog, userId]);

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
    if (!passwordInputRef.current) return;

    const password = passwordInputRef.current.value; // inputref value
    if (password.trim().length === 0) {
      ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
      return;
    }

    axios.post(`/creatorComment/password/${commentId}`, { password })
      .then((res) => {
        const passwordMatch: boolean = res.data;
        if (passwordMatch) {
          closePasswordDialog();
          openConfirmDialog();
        } else {
          if (passwordInputRef.current) {
            passwordInputRef.current.value = '';
          }
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
        closeConfirmDialog();
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
          <DeleteButton onClick={handleDeleteButton} />

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
                  />
                ))
              )
            }
          </div>
        </>
      )}

      <PasswordConfirmDialog
        open={passwordDialogOpen}
        onClose={closePasswordDialog}
        passwordInputRef={passwordInputRef}
        callback={checkPasswordBeforeDelete}
      />

      <DeleteConfirmDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        callback={deleteComment}
      />
    </div>
  );
}
