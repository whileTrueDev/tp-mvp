import {
  Paper, CircularProgress, Avatar, Typography, Button, IconButton, DialogActions, Dialog, DialogContent,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React, { useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import BuildIcon from '@material-ui/icons/Build';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { useStyles } from '../dashboard/UserProfile';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import useDialog from '../../../utils/hooks/useDialog';
import PasswordChangeDialog from '../my-office/sub/PasswordChangeDialog';
import axios from '../../../utils/axios';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

const useUserSettingStyle = makeStyles((theme: Theme) => createStyles({
  smallAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  avatarContainer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordEditButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
  nickNameEditButton: {
    margin: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
}));

function AvatarAndName({ profile }: {profile: User}): JSX.Element|null {
  const classes = useStyles();
  const { isMobile } = useMediaSize();
  const { smallAvatar, avatarContainer } = useUserSettingStyle();
  return (
    profile && (
      <div className={avatarContainer}>
        <Avatar className={isMobile ? smallAvatar : classes.avatar} src={profile.profileImage || ''} />
        {/* 이름 */}
        {profile.name && (
        <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.bold}>
          {`${profile.name}`}
        </Typography>
        )}
      </div>
    )
  );
}

export interface UpdateNicknameDialogProps{
    open: boolean;
    profile: User | undefined;
    onClose: () => void;
  }
function UpdateNicknameDialog(props: UpdateNicknameDialogProps): JSX.Element {
  const { open, onClose, profile } = props;
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthContext();

  const handleChangeNickname = () => {
    // 입력된 닉네임이 유효한지 확인
    if (!inputRef.current || !profile) return;
    const newNickname = inputRef.current.value.trim();
    if (newNickname.length < 2 || newNickname.length > 30) return;

    const data = {
      userId: profile.userId,
      nickname: newNickname,
    };

    // 변경요청
    axios({
      method: 'patch',
      url: 'users/nickname',
      data,
    })
      .then((res) => {
        setUser({ ...user, nickName: newNickname });
        ShowSnack('닉네임이 성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
      })
      .catch((error) => {
        ShowSnack('닉네임 변경 중 오류가 발생했습니다. 문의 부탁드립니다.', 'error', enqueueSnackbar);
        console.error(error);
      })
      .finally(onClose);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>

      <DialogContent>
        <Typography>변경할 닉네임을 입력해주세요</Typography>
        <input ref={inputRef} minLength={2} maxLength={30} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleChangeNickname}
        >
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NicknameAndEmail({ profile }: {profile: User}): JSX.Element|null {
  const classes = useStyles();
  const { user } = useAuthContext();
  const { nickNameEditButton } = useUserSettingStyle();
  const { open: isNicknameDialogOpen, handleClose: closeNicknameDialog, handleOpen: OpenNicknameDialog } = useDialog();
  return (
    <div>
      <div className={classes.flexBox}>
        <Typography component="span">닉네임 :&nbsp;</Typography>
        <Typography variant="h6" component="span" className={classes.bold}>
          {`${user.nickName}`}
        </Typography>
        <Typography component="span">&nbsp;님</Typography>
        <IconButton
          aria-label="닉네임 변경"
          className={nickNameEditButton}
          size="small"
          onClick={OpenNicknameDialog}
        >
          <BuildIcon fontSize="inherit" />
        </IconButton>
        <UpdateNicknameDialog open={isNicknameDialogOpen} onClose={closeNicknameDialog} profile={profile} />
      </div>

      <div>
        {profile.mail && (
        <Typography>{`이메일 : ${profile.mail}`}</Typography>
        )}
      </div>
    </div>
  );
}
function PasswordChangeButton({ profile }: {profile: User}): JSX.Element|null {
  const { isMobile } = useMediaSize();
  const { passwordEditButton } = useUserSettingStyle();
  const { open: isPasswordDialogOpen, handleClose: closePasswordDialog, handleOpen: OpenPasswordDialog } = useDialog();
  return (
    profile.provider === 'local'
      ? (
        <>
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            className={passwordEditButton}
            onClick={OpenPasswordDialog}
          >
            비밀번호 수정
          </Button>
          <PasswordChangeDialog open={isPasswordDialogOpen} onClose={closePasswordDialog} />
        </>
      )
      : null
  );
}

export default function LoginUserProfile(): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const [profileRequestObject, getProfile] = useAxios<User>({
    url: 'users', method: 'GET', params: { userId: auth.user.userId },
  }, { manual: true });

  useEffect(() => {
    if (auth.user.userId) {
      getProfile();
    }
  }, [auth.user.userId, getProfile]);

  return (
    <Paper className={classes.container}>
      {/* 로딩중 */}
      {profileRequestObject.loading && (
      <div className={classes.loading}><CircularProgress /></div>
      )}

      {!profileRequestObject.loading
      && profileRequestObject.data
      && (
      <>
        <AvatarAndName profile={profileRequestObject.data} />
        <NicknameAndEmail profile={profileRequestObject.data} />
        <PasswordChangeButton profile={profileRequestObject.data} />

      </>
      )}
    </Paper>
  );
}
