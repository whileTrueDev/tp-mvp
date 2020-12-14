import React, { useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { Typography, useMediaQuery, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  alert: {
    borderRadius: 0, position: 'fixed', zIndex: 2000, width: '100%', bottom: 0,
  },
}));
export interface PageSizeAlertProps {
  open?: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}
export default function PageSizeAlert({
  open, handleOpen, handleClose,
}: PageSizeAlertProps): JSX.Element {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:1400px)');

  useEffect(() => {
    if (matches) handleOpen();
    else handleClose();
  });

  // border radius 수정 필요
  return (
    <>
      {open && (
      <Alert severity="warning" variant="filled" className={classes.alert}>
        <Typography variant="body1">
          지원하지 않는 화면 사이즈로, 화면이 올바르게 표현되지 않을 수 있습니다. PC 화면을 사용하시기를 권장드립니다.
        </Typography>
      </Alert>
      )}
    </>
  );
}
