import { TextField } from '@material-ui/core';
import React from 'react';
import CustomDialog from '../../../../atoms/Dialog/Dialog';

export interface PasswordConfirmDialogProps {
 open: boolean;
 onClose: () => void,
 callback?: () => void,
 passwordInputRef: React.RefObject<HTMLInputElement>
}

export default function PasswordConfirmDialog(props: PasswordConfirmDialogProps): JSX.Element {
  const {
    open, onClose, callback, passwordInputRef,
  } = props;

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="비밀번호 확인"
      callback={callback}
    >
      <TextField
        margin="dense"
        variant="outlined"
        inputRef={passwordInputRef}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        inputProps={{
          maxLength: 4,
        }}
        lang="en"
        onKeyDown={!callback ? undefined : (e) => {
          if (e.key === 'Enter') callback();
        }}
      />
    </CustomDialog>
  );
}
