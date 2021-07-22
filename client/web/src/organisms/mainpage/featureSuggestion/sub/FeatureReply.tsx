import { Avatar, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useDialog from '../../../../utils/hooks/useDialog';
import transformIdToAsterisk from '../../../../utils/transformAsterisk';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import CheckPasswordDialog from '../../shared/CheckPasswordDialog';

const useStyles = makeStyles((theme) => ({
  container: { width: '100%', marginTop: theme.spacing(3) },
  wrapper: { display: 'flex' },
  avatar: { marginRight: theme.spacing(2) },
  titleSection: { display: 'flex', alignItems: 'center' },
  title: { fontWeight: 'bold', marginRight: theme.spacing(1) },
  deleteText: { marginLeft: theme.spacing(1), cursor: 'pointer', '&:hover': { textDecoration: 'underline' } },
}));
export interface FeatureReplyProps {
  suggestionId: number;
  reply: FeatureSuggestionReply;
  refetch?: () => void;
}
export default function FeatureReply({
  suggestionId,
  reply,
  refetch,
}: FeatureReplyProps): JSX.Element {
  const classes = useStyles();
  // const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const confirmDialog = useDialog();

  const [, deleteRequest] = useAxios({
    url: '/feature-suggestion/reply',
    method: 'DELETE',
  }, { manual: true });

  // 기능제안 글의 비밀번호 확인 요청
  const [, checkPassword] = useAxios({
    url: `/feature-suggestion/${suggestionId}/password`, method: 'POST',
  }, { manual: true });

  // 자기가 남긴 댓글 삭제 클릭
  function handleDeleteClick(id: number) {
    deleteRequest({ data: { id } })
      .then(() => {
        if (refetch) refetch();
      })
      .catch(() => ShowSnack('댓글 작성중 오류가 발생했습니다. 문의부탁드립니다.', 'error', enqueueSnackbar));
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {/* 본인이 아닌 경우 프로필사진 기본 사진 처리 */}
        <Avatar
          src={reply.author ? reply.author.profileImage : ''}
          variant="square"
          className={classes.avatar}
        />
        <div>
          <div className={classes.titleSection}>
            <Typography variant="body2" className={classes.title}>
              {reply.author?.userId === 'Truepoint'
                ? reply.author?.userId
                : transformIdToAsterisk(reply.author?.userId ? reply.author?.userId : reply.userIp)}
            </Typography>
            <Typography variant="caption">{dayjsFormatter(reply.createdAt).fromNow()}</Typography>
            {reply.author?.userId !== 'Truepoint' && (
            <IconButton
              size="small"
              style={{ marginLeft: 4, verticalAlign: 'middle' }}
              onClick={() => {
                // 비밀번호 확인 다이얼로그로 변경
                confirmDialog.handleOpen();
              }}
            >
              <DeleteIcon fontSize="small">삭제</DeleteIcon>
            </IconButton>
            )}
          </div>
          {reply.content.split('\n').map((text) => (
            <Typography key={reply.author + text + reply.createdAt}>{text}</Typography>
          ))}
        </div>
      </div>

      <CheckPasswordDialog
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        checkPassword={checkPassword}
        successHandler={() => {
          handleDeleteClick(reply.replyId);
          confirmDialog.handleClose();
        }}
      >
        <Typography>해당 댓글을 삭제하시겠습니까? 삭제시 복구가 불가능합니다.</Typography>
      </CheckPasswordDialog>
    </div>
  );
}
