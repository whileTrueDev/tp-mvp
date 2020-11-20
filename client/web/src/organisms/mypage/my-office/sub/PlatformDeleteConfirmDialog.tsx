import React from 'react';
import classnames from 'classnames';
import {
  Button, Dialog, DialogActions, DialogContent, Typography, makeStyles,
} from '@material-ui/core';
import { Platform } from '@truepoint/shared/dist/interfaces/Platform.interface';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  bold: { fontWeight: 'bold' },
  capitalize: { textTransform: 'capitalize' },
  container: { textAlign: 'center' },
  alertBox: {
    margin: `${theme.spacing(2)}px 0px`,
    textAlign: 'center',
    minWidth: '100%',
  },
}));

export interface PlatformDeleteConfirmDialogProps {
  platform: Platform;
  open: boolean;
  onClose: () => void;
  confirmCallback: (platform: Platform) => void;
}
export default function PlatformDeleteConfirmDialog({
  platform, open, onClose, confirmCallback,
}: PlatformDeleteConfirmDialogProps): JSX.Element {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
      <div className={classes.titleSection}>
        <Typography
          variant="h6"
          className={classnames(classes.bold, classes.capitalize)}
        >
          {`${platform} 연동 해제`}
        </Typography>
      </div>
      <DialogContent className={classes.container}>
        <Typography className={classes.capitalize}>
          {`${platform}`}
          {' '}
          연동을 해제하시겠습니까?
        </Typography>

        <Alert severity="warning" variant="outlined" className={classes.alertBox}>
          <Typography align="center" variant="body1">플랫폼 연동을 해제하는 경우</Typography>
          <Typography align="center" variant="body1">트루포인트에서 올바른 데이터를 수집하지 못하며</Typography>
          <Typography align="center" variant="body1">연동 해제된 플랫폼에 대한 정보를 트루포인트에서 확인할 수 없습니다.</Typography>
        </Alert>
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
          onClick={() => {
            confirmCallback(platform);
          }}
        >
          해제
        </Button>
      </DialogActions>
    </Dialog>
  );
}
