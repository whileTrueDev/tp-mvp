import { makeStyles, Theme, createStyles } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';

export const useRankingPageLayout = makeStyles((theme: Theme) => createStyles({
  background: {
    backgroundColor: blueGrey[100],
  },
  root: {
    minWidth: '1400px',
    padding: 0,
  },
  top: {
    marginBottom: theme.spacing(6),
  },
  left: {
  },
  right: {
    '&>*:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}));
