import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  recommendContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  recommendButton: {
    [theme.breakpoints.down('sm')]: {
      '& .buttonText': {
        fontSize: theme.spacing(1.5),
      },
    },
  },
  recommendButtons: {
    display: 'inline-flex',
    alignItems: 'center',
    '&>*:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  buttonsContainer: {
    padding: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
}));
