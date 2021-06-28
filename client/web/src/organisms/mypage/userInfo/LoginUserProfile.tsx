import {
  Paper, CircularProgress, Avatar, Typography, IconButton,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { useStyles } from '../dashboard/UserProfile';
import useDialog from '../../../utils/hooks/useDialog';
import UpdateUserInfoDialog from './UpdateUserInfoDialog';

const useUserSettingStyle = makeStyles((theme: Theme) => createStyles({
  smallAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
  },
  avatarContainer: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  passwordEditButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
  nickNameEditButton: {
    padding: theme.spacing(0, 1),
    fontSize: theme.typography.body1.fontSize,
  },
  email: {
    fontSize: theme.typography.body2.fontSize,
  },
}));

function AvatarArticle(): JSX.Element|null {
  const auth = useAuthContext();
  const { smallAvatar, avatarContainer } = useUserSettingStyle();

  return (
    <article className={avatarContainer}>
      <Avatar
        className={smallAvatar}
        src={auth.user.profileImage}
      />
    </article>
  );
}

function UserInfoSection(): JSX.Element|null {
  const { user } = useAuthContext();
  const { nickNameEditButton, email } = useUserSettingStyle();
  const { open: isNicknameDialogOpen, handleClose: closeNicknameDialog, handleOpen: OpenNicknameDialog } = useDialog();

  return (
    <section>
      <Typography variant="h5" component="span" style={{ fontWeight: 'bold' }}>
        {`${user.nickName}`}
      </Typography>
      <Typography component="span">&nbsp;님</Typography>
      <IconButton
        aria-label="user-info-update"
        className={nickNameEditButton}
        size="small"
        onClick={OpenNicknameDialog}
      >
        <SettingsIcon fontSize="inherit" />
      </IconButton>
      <Typography className={email}>{`${user.mail}`}</Typography>
      <UpdateUserInfoDialog open={isNicknameDialogOpen} onClose={closeNicknameDialog} />
    </section>
  );
}

export default function LoginUserProfile(): JSX.Element {
  const classes = useStyles();
  const { loginLoading, user } = useAuthContext();
  return (
    <Paper className={classes.container}>
      {/* 로딩중 */}
      {loginLoading && (
      <div className={classes.loading}><CircularProgress /></div>
      )}

      {!loginLoading
      && user.userId
      && (
      <>
        <AvatarArticle />
        <UserInfoSection />
      </>
      )}
    </Paper>
  );
}
