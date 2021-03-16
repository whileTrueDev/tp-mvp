import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  topTenWrapper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  header: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));
export const useTabs = makeStyles((theme: Theme) => createStyles({
  indicator: {
    display: 'none',
  },
  scroller: {
    padding: theme.spacing(1),
  },
}));

// https://mui-treasury.com/styles/tabs/
export const useTabItem = makeStyles((theme: Theme) => {
  const defaultBgColor = theme.palette.background.paper;
  const defaultLabelColor = theme.palette.common.black;
  const rootHeight = 80;
  return createStyles({
    root: {
      textTransform: 'initial',
      backgroundColor: defaultBgColor,
      height: rootHeight,
      width: '80%',
      overflow: 'visible',
      position: 'relative',
      borderBottom: `1px solid ${theme.palette.divider}`,

      '&:after': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        right: `-${rootHeight / 2}px`,
        top: 0,
        borderLeft: `${rootHeight / 2}px solid ${defaultBgColor}`,
        borderTop: `${rootHeight / 2}px solid transparent`,
        borderBottom: `${rootHeight / 2}px solid transparent`,
      },
    },
    selected: {
      '&$root': {
        filter: `drop-shadow(2px 2px 3px ${theme.palette.action.disabled}) drop-shadow(0px 0px 10px ${theme.palette.divider})`,
        zIndex: 1,
      },
      '& $wrapper': {
        color: theme.palette.primary.main,
      },
      '& $wrapper svg': {
        opacity: 1,
      },
    },
    wrapper: {
      color: defaultLabelColor,
      position: 'relative',
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: theme.spacing(2),
      '& svg': {
        opacity: 0,
        fill: theme.palette.primary.main,
        fontSize: theme.typography.h3.fontSize,
      },

    },
  });
});
