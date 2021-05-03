import React from 'react';
import CheckPasswordForm, { CheckPasswordFormProps } from '../../../atoms/CheckPasswordForm';
import CustomDialog, { CustomDialogProps } from '../../../atoms/Dialog/Dialog';

type CheckPasswordDialogIntersactionType = Omit<CheckPasswordFormProps, 'closeDialog'> & Omit<CustomDialogProps, 'children'>;
interface CheckPasswordDialogProps extends CheckPasswordDialogIntersactionType {
  children?: React.ReactNode;
}

export default function CheckPasswordDialog({
  open,
  onClose,
  checkPassword,
  successHandler,
  children,
}: CheckPasswordDialogProps): React.ReactElement {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="비밀번호 확인"
    >
      <CheckPasswordForm
        closeDialog={onClose}
        checkPassword={checkPassword}
        successHandler={successHandler}
      >
        {children}
      </CheckPasswordForm>
    </CustomDialog>
  );
}
