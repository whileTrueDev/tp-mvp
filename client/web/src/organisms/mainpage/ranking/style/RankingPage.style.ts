import { makeStyles, Theme, createStyles } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { MYPAGE_MAIN_MIN_WIDTH } from '../../../../assets/constants';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;

  return createStyles({
    background: {
      backgroundColor: blueGrey[100],
    },
    container: {
      minWidth: `${MYPAGE_MAIN_MIN_WIDTH}px`,
      padding: 0,
    },
    top: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(6),
      borderTop: borderStyle,
      borderBottom: borderStyle
    },
    left: {
    },
    right: {
      '&>*:not(:last-child)': {
        marginBottom: theme.spacing(4),
      },
    },
  })
}
);

export const useCarouselStyle = makeStyles((theme: Theme) => createStyles({
  buttonIcon: {
    color: theme.palette.common.black,
    fontSize: theme.typography.h1.fontSize,
  }
}))