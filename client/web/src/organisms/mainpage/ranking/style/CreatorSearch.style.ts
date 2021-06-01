import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    paddingBottom: theme.spacing(3),
  },
}));

export const useSearchTableStyle = makeStyles((theme: Theme) => createStyles({
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  border: {
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
  },
}));
