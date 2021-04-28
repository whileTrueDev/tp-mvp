import { Typography } from '@material-ui/core';
import React from 'react';
import CustomDialog from '../../../../atoms/Dialog/Dialog';

export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  callback: () => void;
  title?: string;
}

export default function DeleteConfirmDialog(props: DeleteConfirmDialogProps): JSX.Element {
  const {
    open, onClose, callback, title = '댓글 삭제',
  } = props;

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      title={title}
      callback={callback}
    >
      <Typography>정말로 삭제하시겠습니까?</Typography>
    </CustomDialog>
  );
}
