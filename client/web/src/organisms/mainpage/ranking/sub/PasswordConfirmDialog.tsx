import { Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import CustomDialog from '../../../../atoms/Dialog/Dialog';

export interface PasswordConfirmDialogProps {
 open: boolean;
 onClose?: () => void,
 callback? : () => void
}

export default function PasswordConfirmDialog(props: PasswordConfirmDialogProps): JSX.Element {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { open, onClose, callback } = props;

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        if (passwordInputRef.current) {
          passwordInputRef.current.value = '';
        }
        if (onClose) {
          onClose();
        }
      }}
      title="비밀번호 확인"
      callback={callback}
    >
      <Typography>비밀번호를 입력해주세요</Typography>
      <input ref={passwordInputRef} />
    </CustomDialog>
  );
}
