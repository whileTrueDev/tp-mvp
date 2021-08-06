import {
  Avatar, Button, Typography,
} from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import useDialog from '../../../../utils/hooks/useDialog';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import useToggle from '../../../../utils/hooks/useToggle';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import { useCreatorCommentItemStyle } from '../style/CreatorComment.style';
import CommentForm from './CommentForm';
import DeleteButton from './DeleteButton';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import PasswordConfirmDialog from './PasswordConfirmDialog';
import ReportConfirmDialog from './ReportConfirmDialog';
import { displayNickname } from '../../../../utils/checkAvailableNickname';
import useChildrenPostCommentList from '../../../../utils/hooks/query/useChildrenPostCommentList';
import useMutateCreatorComment from '../../../../utils/hooks/mutation/useMutateCreatorComment';
import { useCheckPassword } from '../../../../utils/hooks/mutation/useCheckPassword';

export interface CommentItemProps extends Record<string, any>{
  /** 댓글 고유 id */
  commentId: number;
  /** 댓글이 달린 글의 고유 id */
  postId?: number;

  /** 댓글 삭제 여부 1이면 삭제된 댓글, 0이면 삭제 안된 댓글 */
  deleteFlag?: number;

  /** 반복문에서 key 값으로 사용될 prop 명(commentId, replyId 등 고유 id 값의 프로퍼티명) */
  idProperty?: string;

  /** 댓글 작성자 id */
  userId?: string;
  /** 댓글 작성자 nickname */
  nickname: string;
  /** 댓글 내용 */
  content: string;
  /** 댓글 생성일자 */
  createDate: Date;
  /** 댓글 작성자 프로필 이미지 */
  profileImage?: string;

  /** 댓글 좋아요 개수 */
  likesCount?: number;
  /** 댓글 싫어요 개수 */
  hatesCount?: number;

  /** 대댓글 개수 */
  childrenCount?: number;

  /** 좋아요 눌렀는지 여부 */
  isLiked?: boolean;
  /** 싫어요 눌렀는지 여부 */
  isHated?: boolean;
  /** 자식댓글 (대댓글) 인지 여부 */
  childComment?: boolean;

  /** 신고하기 버튼 핸들러 */
  onReport?: (commentId: number) => Promise<any>;

  /** 좋아용 버튼 핸들러 resolve(res)리턴하는 Promise를 반환한다 */
  onClickLike?: (commentId: number) => Promise<any>;
  /** 싫어요 버튼 핸들러 resolve(res)리턴하는 Promise를 반환한다 */
  onClickHate?: (commentId: number) => Promise<any>;
  /** 삭제 버튼 핸들러 resolve(res)리턴하는 Promise를 반환한다 */
  onDelete?: (replyId: number, parentReplyId?: number) => Promise<any>;

  /** 부모댓글 id */
  parentCommentId?: number;
}

export default function PostCommentItem(props: CommentItemProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useMediaSize();
  const authContext = useAuthContext();
  const classes = useCreatorCommentItemStyle();
  const {
    userId, // 코멘트를 작성한 유저의 userId, undefined인 경우 비로그인하여 작성한 댓글
    nickname,
    profileImage,
    commentId,
    deleteFlag = 0,
    content,
    createDate,
    likesCount,
    hatesCount,
    childrenCount = 0,
    isHated = false,
    isLiked = false,
    childComment = false,
    onReport,
    onClickLike,
    onClickHate,
    onDelete,
    parentCommentId,
  } = props;

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // 다이얼로그 오픈 상태, 핸들러
  const { open: passwordDialogOpen, handleOpen: openPasswordDialog, handleClose: closePasswordDialog } = useDialog();
  const { open: confirmDialogOpen, handleOpen: openConfirmDialog, handleClose: closeConfirmDialog } = useDialog();
  const { open: reportDialogOpen, handleOpen: openReportDialog, handleClose: closeReportDialog } = useDialog();

  // 좋아요 싫어요 상태
  const [likeClicked] = useState<boolean>(isLiked);
  const [hateClicked] = useState<boolean>(isHated);
  const [likeNumber, setLikeNumber] = useState<number>(likesCount || 0);
  const [hateNumber, setHateNumber] = useState<number>(hatesCount || 0);

  // 대댓글쓰기, 대댓글보기 열림 상태, 토글 핸들러
  const { toggle: commentFormOpen, handleToggle: handleCommentFormOpen } = useToggle();
  const { open: replyListOpen, handleOpen: handleReplyListOpen, handleClose: handleReplyListClose } = useDialog();

  // 대댓글 목록 상태
  const enableLoadChildComment = !childComment && Boolean(childrenCount) && replyListOpen; // 부모댓글 && 자식댓글 개수가 있음 &&  대댓글 창이 열려있을때 fetch
  const { data } = useChildrenPostCommentList(commentId, enableLoadChildComment);
  // 대댓글 개수
  const [repliesCount, setRepliesCount] = useState<number>(childrenCount);

  // 대댓글 생성 요청
  const { mutate: createComment } = useMutateCreatorComment();

  useEffect(() => {
    setRepliesCount(data ? data.length : childrenCount || 0);
  }, [childrenCount, data]);

  const handleVoteResult = useCallback((result: {like: number, hate: number}): void => {
    setLikeNumber(result.like);
    setHateNumber(result.hate);
  }, []);

  const clickLike = useCallback(() => {
    if (onClickLike) {
      onClickLike(commentId)
        .then((res) => handleVoteResult(res));
    }
  }, [commentId, handleVoteResult, onClickLike]);

  const clickHate = useCallback(() => {
    if (onClickHate) {
      onClickHate(commentId)
        .then((res) => handleVoteResult(res));
    }
  }, [commentId, handleVoteResult, onClickHate]);

  const handleDeleteButton = useCallback(() => {
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

  // 대댓글 생성 요청 성공 후 실행할 일들
  const replySubmitCallback = useCallback(() => {
    handleCommentFormOpen();// 대댓글 작성폼 닫기
    if (!replyListOpen) { // 대댓글 목록 열려있지 않으면 열기
      handleReplyListOpen();
    }
  }, [handleCommentFormOpen, handleReplyListOpen, replyListOpen]);

  // 비밀번호 확인 요청
  const { mutateAsync: checkPassword } = useCheckPassword(`/community/replies/${commentId}/password`);
  const checkPasswordBeforeDelete = () => {
    if (!passwordInputRef.current) return;

    const password = passwordInputRef.current.value; // inputref value
    if (password.trim().length === 0) {
      ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
      return;
    }

    checkPassword({ password })
      .then((res) => {
        const passwordMatch: boolean = res;
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
    if (onDelete) {
      onDelete(commentId, parentCommentId)
        .then(() => {
          closeConfirmDialog();
        });
    }
  };

  const reportComment = useCallback(() => {
    if (onReport) {
      onReport(commentId)
        .then(() => {
          closeReportDialog();
        });
    }
  }, [closeReportDialog, commentId, onReport]);

  const time = dayjsFormatter(createDate, 'default');

  return (
    <div className={classnames(classes.commentItem, { child: childComment })} id={`commentId-${commentId}`}>
      <div className={classes.header}>
        <div className={classes.userInfo}>
          <Avatar
            component="span"
            className={classes.smallAvatar}
            src={userId !== 'Truepoint'
              ? profileImage
              : '/images/favicon/android-icon-36x36.png'}
          />
          <Typography component="span" className="nickname">
            { displayNickname(userId, nickname)}
          </Typography>
        </div>
        <div className={classes.headerActions}>
          {deleteFlag === 1 ? (
            <Typography component="span" className="time" color="textSecondary">{time}</Typography>
          ) : (
            <>
              <Button
                aria-label="신고하기"
                className={classes.reportButton}
                onClick={openReportDialog}
              >
                <img
                  src="/images/rankingPage/reportIcon.png"
                  srcSet="/images/rankingPage/reportIcon@2x.png 2x"
                  alt="신고하기"
                />
              </Button>
              <Typography component="span" className="time" color="textSecondary">{time}</Typography>
              <DeleteButton onClick={handleDeleteButton} />
            </>
          )}
        </div>
      </div>

      <Typography className={classes.content}>
        {content}
      </Typography>

      <div className={classes.actions}>

        {!childComment && (
          <div className={classes.nestedComments}>
            <Button
              onClick={openCommentWriteForm}
              startIcon={<ReplyIcon className={classes.replyIcon} />}
            >
              대댓글쓰기
            </Button>
            <Button onClick={replyListOpen ? handleReplyListClose : handleReplyListOpen}>{`댓글 ${repliesCount}개`}</Button>
          </div>
        )}

        {(deleteFlag === 0 && onClickLike && onClickHate) && (
        <div className={classes.recommendIcons}>
          <Button
            onClick={clickLike}
            className={classnames(classes.actionButton, 'likeButton', { [classes.liked]: likeClicked })}
            size={isMobile ? 'small' : undefined}
            startIcon={
            isMobile
              ? <img width="24" height="24" src="/images/rankingPage/thumb_up.png" alt="추천" />
              : <img width="32" height="28" src="/images/rankingPage/thumb_up.png" alt="추천" />
          }
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
            className={classnames(classes.actionButton, 'hateButton', { [classes.hated]: hateClicked })}
            size={isMobile ? 'small' : undefined}
            startIcon={
              isMobile
                ? <img width="24" height="24" src="/images/rankingPage/thumb_down.png" alt="비추천" />
                : <img width="32" height="28" src="/images/rankingPage/thumb_down.png" alt="비추천" />
          }
          >
            <Typography
              component="span"
              className={classes.countText}
            >
              {hateNumber}
            </Typography>
          </Button>
        </div>
        )}

      </div>

      {/* 대댓글이 아닌 경우만 대댓글 입력창 & 대댓글 목록 표시 */}
      {!childComment && (
        <>
          <div className={classnames(classes.commentFormContainer, { open: commentFormOpen })}>
            <CommentForm
              postUrl={`/community/replies/child/${commentId}`}
              postRequest={createComment}
              invalidateQueryKey={['childrenPostComment', commentId]}
              callback={replySubmitCallback}
            />
          </div>

          <div className={classnames(classes.replyList, { open: replyListOpen })}>
            {
              (data && (
                data.map((reply) => (
                  <PostCommentItem
                    childComment
                    key={reply.replyId}
                    {...reply}
                    deleteFlag={reply.deleteFlag ? 1 : 0}
                    commentId={reply.replyId}
                    onReport={onReport}
                    onClickLike={onClickLike}
                    onClickHate={onClickHate}
                    onDelete={onDelete}
                    parentCommentId={commentId}
                  />
                ))
              )
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

      <ReportConfirmDialog
        open={reportDialogOpen}
        onClose={closeReportDialog}
        callback={reportComment}
      />
    </div>
  );
}
