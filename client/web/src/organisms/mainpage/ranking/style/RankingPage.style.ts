import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { MYPAGE_MAIN_MIN_WIDTH } from '../../../../assets/constants';
import grey from '@material-ui/core/colors/grey';


export const useRankingPageLayout = makeStyles((theme: Theme) => createStyles({
  background: {
    backgroundColor: grey[100],
  },
  root: {
    minWidth: `${MYPAGE_MAIN_MIN_WIDTH}px`,
    padding: 0,
  },
  top: {
    marginBottom: theme.spacing(6),
  },
  left: {
  },
  right: {
    '&>*:not(:last-child)': {
      marginBottom: theme.spacing(4),
    },
  },
}));
