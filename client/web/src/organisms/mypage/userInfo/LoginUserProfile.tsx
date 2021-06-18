import {
  Paper, CircularProgress, Avatar, Typography, Button,
  IconButton, DialogActions, Dialog, DialogContent,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useRef } from 'react';
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

function AvatarAndName(): JSX.Element|null {
  const classes = useStyles();
  const auth = useAuthContext();
  const { isMobile } = useMediaSize();
  const { smallAvatar, avatarContainer } = useUserSettingStyle();
  // const { open, handleClose, handleOpen } = useDialog();

  return (
    <div className={avatarContainer}>
      {/* <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={(
          <IconButton
            aria-label="프로필 사진 변경"
            size="small"
            onClick={handleOpen}
          >
            <BuildIcon fontSize="inherit" />
          </IconButton>
          )}
      >
        <Avatar
          className={smallAvatar}
          src={auth.user.profileImage}
        />
      </Badge>
      <UpdateProfileImageDialog open={open} onClose={handleClose} /> */}
      <Avatar
        className={smallAvatar}
        src={auth.user.profileImage}
      />
      {/* 이름 */}
      <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.bold}>
        {`${auth.user.userName}`}
      </Typography>
    </div>
  );
}

export interface UpdateDialogProps{
    open: boolean;
    onClose: () => void;
  }
function UpdateNicknameDialog(props: UpdateDialogProps): JSX.Element {
  const { open, onClose } = props;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthContext();

  const handleChangeNickname = () => {
    // 입력된 닉네임이 유효한지 확인
    if (!inputRef.current || !user.userId) return;
    const newNickname = inputRef.current.value.trim();
    if (newNickname.length < 2 || newNickname.length > 30) return;

    const data = {
      userId: user.userId,
      nickname: newNickname,
    };

    // 변경요청
    axios({
      method: 'patch',
      url: 'users/nickname',
      data,
    })
      .then((res) => {
        setUser((prevUser) => ({ ...prevUser, nickName: newNickname }));
        ShowSnack('닉네임이 성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
        onClose();
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 409) { // nickname conflict
          ShowSnack('중복된 닉네임입니다. 다른 닉네임을 사용해주세요.', 'error', enqueueSnackbar);
        } else {
          ShowSnack('닉네임 변경 중 오류가 발생했습니다. 문의 부탁드립니다.', 'error', enqueueSnackbar);
        }
      });
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

function NicknameAndEmail(): JSX.Element|null {
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
        <UpdateNicknameDialog open={isNicknameDialogOpen} onClose={closeNicknameDialog} />
      </div>

      <Typography>{`이메일 : ${user.mail}`}</Typography>
    </div>
  );
}
function PasswordChangeButton(): JSX.Element|null {
  const { isMobile } = useMediaSize();
  const { user } = useAuthContext();
  const { passwordEditButton } = useUserSettingStyle();
  const { open: isPasswordDialogOpen, handleClose: closePasswordDialog, handleOpen: OpenPasswordDialog } = useDialog();
  return (
    user.provider === 'local'
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
        <AvatarAndName />
        <NicknameAndEmail />
        <PasswordChangeButton />
      </>
      )}
    </Paper>
  );
}
