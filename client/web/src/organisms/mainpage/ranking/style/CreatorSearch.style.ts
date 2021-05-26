import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(4),
    // backgroundColor: theme.palette.grey[100],
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}));

export const useSearchTableStyle = makeStyles((theme: Theme) => createStyles({
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  border: {
    [theme.breakpoints.down('sm')]: { backgroundColor: theme.palette.grey[100], padding: theme.spacing(1) },
  },
}));
