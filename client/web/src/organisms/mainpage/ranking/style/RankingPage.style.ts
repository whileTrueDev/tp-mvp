import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../../../assets/constants';

export const useRankingPageLayout = makeStyles((theme: Theme) => {
  const { type } = theme.palette;
  const borderStyle = `${theme.spacing(1)}px solid ${theme.palette.common.black}`;
  const rankingPageContainerWidth = RANKING_PAGE_CONTAINER_WIDTH;

  return createStyles({
    background: {
      backgroundColor: type === 'light' ? theme.palette.primary.main : theme.palette.grey[900],
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
