import { Typography } from '@material-ui/core';
import React from 'react';
import CustomDialog from '../../../../atoms/Dialog/Dialog';

export interface ReportConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  callback: () => void;
  title?: string;
}

export default function ReportConfirmDialog(props: ReportConfirmDialogProps): JSX.Element {
  const {
    open, onClose, callback, title = '댓글 신고',
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
      <Typography>해당 댓글을 신고하시겠습니까?</Typography>
    </CustomDialog>
  );
}
