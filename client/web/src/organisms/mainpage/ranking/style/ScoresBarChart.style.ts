import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  barChartSection: {
    position: 'relative',
  },
  header: {
    padding: theme.spacing(2),
  },
  title: {
    color: theme.palette.text.secondary,
  },
}));
