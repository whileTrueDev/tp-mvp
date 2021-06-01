import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { RANKING_PAGE_CONTAINER_WIDTH, MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const { type } = theme.palette;

  return createStyles({
    background: {
      backgroundColor: type === 'light' ? theme.palette.primary.main : theme.palette.background.paper,
      minHeight: '100vh',
      maxWidth: MAX_WIDTH_DESKTOP,
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        backgroundColor: type === 'light' ? theme.palette.grey[200] : theme.palette.background.paper,
      },
    },
    container: {
      maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
      padding: 0,
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        padding: theme.spacing(1),
      },
    },
    top: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(6),
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
