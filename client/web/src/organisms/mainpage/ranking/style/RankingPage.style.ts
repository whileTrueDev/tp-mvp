import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const { type } = theme.palette;
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;
  const RANKING_PAGE_CONTAINER_WIDTH = '1400px';

  return createStyles({
    background: {
      minWidth: RANKING_PAGE_CONTAINER_WIDTH,
      backgroundColor: type === 'light' ? theme.palette.primary.main : theme.palette.background.paper,
      minHeight: '100vh',
    },
    container: {
      minWidth: RANKING_PAGE_CONTAINER_WIDTH,
      maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
      padding: 0,
    },
    top: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(6),
      borderTop: borderStyle,
      borderBottom: borderStyle,
    },
    left: {
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
