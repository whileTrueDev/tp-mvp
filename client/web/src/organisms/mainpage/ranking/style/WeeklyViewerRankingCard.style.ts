import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useWeeklyViewerStyle = makeStyles((theme: Theme) => createStyles({
  weeklyViewerContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  weeklyViewerTitle: {
    color: theme.palette.text.secondary,
  },
}));
