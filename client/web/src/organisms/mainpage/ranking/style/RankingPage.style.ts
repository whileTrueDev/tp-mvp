import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../../../assets/constants';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const { type } = theme.palette;
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;

  return createStyles({
    background: {
      backgroundColor: type === 'light' ? theme.palette.primary.main : theme.palette.background.paper,
      minHeight: '100vh',
      [theme.breakpoints.down('sm')]: {
        backgroundColor: type === 'light' ? theme.palette.grey[200] : theme.palette.background.paper,
      },
    },
    container: {
      maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
      padding: 0,
      [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        padding: theme.spacing(1),
      },
    },
    top: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(6),
      borderTop: borderStyle,
      borderBottom: borderStyle,
    },
    left: {
      [theme.breakpoints.down('sm')]: {
        padding: 0,
      },
    },
    right: {
      '&>*:not(:last-child)': {
        marginBottom: theme.spacing(4),
      },
    },
  });
});

export const useCarouselStyle = makeStyles((theme: Theme) => createStyles({
  buttonIcon: {
    color: theme.palette.common.black,
    fontSize: theme.typography.h1.fontSize,
  },
}));
