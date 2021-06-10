import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  recommendContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  recommendButton: {
    '& .buttonText': {
      paddingLeft: theme.spacing(0.3),
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.4),
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
  recommandText: {
    fontSize: theme.spacing(2.4),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.6),
    },
  },
}));
