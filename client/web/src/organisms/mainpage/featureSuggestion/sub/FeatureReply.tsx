import React from 'react';
import moment from 'moment';
import { Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useDialog from '../../../../utils/hooks/useDialog';
import CustomDialog from '../../../../atoms/Dialog/Dialog';
import transformIdToAsterisk from '../../../../utils/transformAsterisk';

const useStyles = makeStyles((theme) => ({
  container: { width: '100%', marginTop: theme.spacing(3) },
  wrapper: { display: 'flex' },
  avatar: { marginRight: theme.spacing(2) },
  titleSection: { display: 'flex', alignItems: 'center' },
  title: { fontWeight: 'bold', marginRight: theme.spacing(1) },
  deleteText: { marginLeft: theme.spacing(1), cursor: 'pointer', '&:hover': { textDecoration: 'underline' } },
}));
export interface FeatureReplyProps {
  replyId: number;
  author: string;
  content: string;
  createdAt: string | Date;
  avatarLogo?: string;
  refetch?: () => void;
}
export default function FeatureReply({
  replyId, avatarLogo = '/images/logo/logo_truepoint.png', author, createdAt, content, refetch,
}: FeatureReplyProps): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const confirmDialog = useDialog();

  const [, deleteRequest] = useAxios({
    url: '/feature-suggestion/reply',
    method: 'DELETE',
  }, { manual: true });

  // 자기가 남긴 댓글 삭제 클릭
  const { enqueueSnackbar } = useSnackbar();
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
        <Avatar src={auth.user.userId === author ? avatarLogo : ''} variant="square" className={classes.avatar} />
        <div>
          <div className={classes.titleSection}>
            <Typography variant="body2" className={classes.title}>
              {((auth.user.userId === author) || author === 'Truepoint')
                ? author
                : transformIdToAsterisk(author, 1.8)}
            </Typography>
            <Typography variant="caption">{moment(createdAt).fromNow()}</Typography>
            {author === auth.user.userId && (
              <Typography
                className={classes.deleteText}
                style={{ marginLeft: 8, cursor: 'pointer' }}
                variant="caption"
                onClick={() => {
                  confirmDialog.handleOpen();
                }}
              >
                삭제
              </Typography>
            )}
          </div>
          {content.split('\n').map((text) => (
            <Typography key={text}>{text}</Typography>
          ))}
        </div>
      </div>

      <CustomDialog
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        callback={() => {
          handleDeleteClick(replyId);
        }}
      >
        <Typography>해당 댓글을 삭제하시겠습니까?</Typography>
      </CustomDialog>
    </div>
  );
}
