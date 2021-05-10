import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const { type } = theme.palette;
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;

  return createStyles({
    background: {
      minWidth: 1280,
      backgroundColor: type === 'light' ? theme.palette.primary.main : theme.palette.background.paper,
      minHeight: '100vh',
    },
    container: {
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
