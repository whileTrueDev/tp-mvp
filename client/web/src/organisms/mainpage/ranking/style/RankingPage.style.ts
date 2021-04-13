import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;
  const rankingPageContainerWidth = `${1920 - 190}px`;
  return createStyles({
    background: {
      backgroundColor: theme.palette.primary.main,
    },
    container: {
      minWidth: rankingPageContainerWidth,
      maxWidth: rankingPageContainerWidth,
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
