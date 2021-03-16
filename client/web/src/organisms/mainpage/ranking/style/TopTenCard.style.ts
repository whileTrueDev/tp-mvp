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
  const defaultMinWith = '90%';
  const rootHeight = theme.spacing(8);
  return createStyles({
    root: {
      textTransform: 'initial',
      backgroundColor: defaultBgColor,
      height: rootHeight,
      minHeight: 'auto',
      width: defaultMinWith,
      overflow: 'visible',
      position: 'relative',
      borderBottom: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.up('sm')]: {
        minWidth: defaultMinWith,
      },
      '&:after': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: `-${rootHeight / 4}px`,
        borderLeft: `${rootHeight / 4}px solid ${defaultBgColor}`,
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
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      flexDirection: 'row',
      justifyContent: 'center',
      '& svg': {
        opacity: 0,
        fill: theme.palette.primary.main,
        fontSize: theme.typography.h5.fontSize,
      },

    },
  });
});
