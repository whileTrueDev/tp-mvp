import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

interface ErrorSnackBarPorps {
  open: boolean;
  message: string;
}

export default function ErrorSnackBar(props: ErrorSnackBarPorps) {
  const classes = useStyles();
  const { open, message } = props;
  const [snackBarOpen, setSnackBarOpen] = React.useState<boolean>();

  React.useEffect(() => {
    setSnackBarOpen(open);
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={1000}
        style={{
          left: '70%',
          bottom: '70%'
        }}
        onClose={handleClose}
      >
        <Alert severity="error">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
