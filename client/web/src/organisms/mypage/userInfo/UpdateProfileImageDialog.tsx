import {
  Typography, Button, DialogActions, Dialog, DialogContent,
} from '@material-ui/core';
import React, { useRef } from 'react';
import { useSnackbar } from 'notistack';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { UpdateDialogProps } from './LoginUserProfile';

/** 내정보 페이지 프로필 사진 변경시 사용할 다이얼로그.. */
export function UpdateProfileImageDialog(props: UpdateDialogProps): JSX.Element {
  const { open, onClose } = props;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthContext();

  const handleProfileChange = () => {
    console.log('send');
  };
  // 변경요청
  // axios({
  //   method: 'patch',
  //   url: 'users/profileImage',
  //   data,
  // })
  //   .then((res) => {
  //     setUser((prevUser) => ({ ...prevUser, nickName: newNickname }));
  //     ShowSnack('닉네임이 성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
  //   })
  //   .catch((error) => {
  //     ShowSnack('닉네임 변경 중 오류가 발생했습니다. 문의 부탁드립니다.', 'error', enqueueSnackbar);
  //     console.error(error);
  //   })
  //   .finally(onClose);
  // };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>

      <DialogContent>
        <Typography>변경할 프로필 이미지 선택</Typography>
        <input ref={inputRef} type="file" accept="image/*" />
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
          onClick={handleProfileChange}
        >
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}
