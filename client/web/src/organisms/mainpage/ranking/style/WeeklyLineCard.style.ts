import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useWeeklyLineCardStyle = makeStyles((theme: Theme) => createStyles({
  weeklyContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  graphContainer: {
    width: '80%',
    margin: '0 auto',
  },
}));
