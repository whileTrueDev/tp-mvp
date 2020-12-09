import React, { useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { Typography, useMediaQuery } from '@material-ui/core';
import { COMMON_APP_BAR_HEIGHT } from '../../../assets/constants';

export interface PageSizeAlertProps {
  open?: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}
export default function PageSizeAlert({
  open, handleOpen, handleClose,
}: PageSizeAlertProps): JSX.Element {
  const matches = useMediaQuery('(max-width:1400px)');
  useEffect(() => {
    if (matches) handleOpen();
    else handleClose();
  });

  // border radius 수정 필요
  return (
    <>
      {open && (
      <Alert
        severity="info"
        variant="filled"
        style={{
          borderRadius: 0, position: 'fixed', zIndex: 2000, width: '100%', top: COMMON_APP_BAR_HEIGHT - 20,
        }}
      >
        <Typography variant="body1">
          지원하지 않는 화면 사이즈로, 화면이 올바르게 표현되지 않을 수 있습니다. PC 화면을 사용하시기를 권장드립니다.
        </Typography>
      </Alert>
      )}
    </>
  );
}
