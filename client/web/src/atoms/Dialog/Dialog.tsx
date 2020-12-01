import React from 'react';
// material ui style helper, Theme type
import { withStyles, Theme } from '@material-ui/core/styles';
// material ui core components
import {
  Slide, Dialog, Button, IconButton, Typography, Grid,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
// icons
import CloseIcon from '@material-ui/icons/Close';

const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[300],
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
}))(({ children, classes, onClose }:
  { children: React.ReactNode; classes: any; onClose: () => void }) => (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
        <Grid item>
          <Typography className={classes.title}>{children}</Typography>
        </Grid>
        <Grid item>
          {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </MuiDialogTitle>
));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface CustomDialogProps {
  title?: React.ReactNode;
  open: boolean;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  onClose: () => void;
  callback?: () => void;
  [rest: string]: any;
}

const Transition: any = React.forwardRef((props: any, ref: any) => <Slide direction="up" ref={ref} {...props} />);

function CustomDialog({
  title, open, onClose, children, buttons, callback, ...rest
}: CustomDialogProps): JSX.Element {
  return (
    <Dialog
      onClose={onClose}
      TransitionComponent={Transition}
      open={open}
      {...rest}
    >
      {title ? (
        <DialogTitle onClose={onClose}>
          {title}
        </DialogTitle>
      ) : null}
      <DialogContent>
        {children}
      </DialogContent>
      {buttons && (
        <DialogActions>
          {buttons}
        </DialogActions>
      )}
      {callback
        && (
          <DialogActions>
            <Button onClick={onClose} color="primary">
              취소
            </Button>
            <Button onClick={callback} color="primary" autoFocus>
              확인
            </Button>
          </DialogActions>
        )}
    </Dialog>
  );
}
export default CustomDialog;
