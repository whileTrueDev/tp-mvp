import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CAROUSEL_HEIGHT } from '../../../../assets/constants';

export const useWeeklyLineCardStyle = makeStyles((theme: Theme) => createStyles({
  weeklyContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    height: CAROUSEL_HEIGHT,
  },
  graphContainer: {
    width: '80%',
    margin: '0 auto',
  },
}));
