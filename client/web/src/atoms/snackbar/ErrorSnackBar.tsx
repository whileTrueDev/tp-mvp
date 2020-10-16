import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Typograpy from '@material-ui/core/Typography';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: '120px',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

interface ErrorSnackBarPorps <T>{
  message: string;
  closeCallback?: (param?: T) => void;
}

export default function ErrorSnackBar(props: ErrorSnackBarPorps<any>): JSX.Element {
  const classes = useStyles();
  const { message, closeCallback } = props;
  const [snackBarOpen, setSnackBarOpen] = React.useState<boolean>(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);

    if (closeCallback) closeCallback();
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2500}
        style={{
          left: '70%',
          bottom: '60%',
          padding: '25px',
          width: 'auto',
        }}
        onClose={handleClose}
      >
        <Alert severity="error">
          <Typograpy style={{ fontSize: '20px', whiteSpace: 'nowrap' }}>
            {message}
          </Typograpy>

        </Alert>
      </Snackbar>
    </div>
  );
}
