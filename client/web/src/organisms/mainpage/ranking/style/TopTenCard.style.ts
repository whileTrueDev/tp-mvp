import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// TopTenCard 스타일
export const useTopTenCard = makeStyles((theme: Theme) => createStyles({
  topTenWrapper: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    position: 'relative',
    border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.shape.borderRadius,
  },
  recentAnalysisDate: {
    position: 'absolute',
    transform: 'translateY(-100%)',
  },
  left: {
    backgroundColor: theme.palette.divider,
  },
  header: {
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    '&>:nth-child(1)': {
      fontSize: theme.typography.h6.fontSize,
    },
    '&>:nth-child(2)': {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
    },
  },
  viewerTab: {
    marginTop: theme.spacing(2),
  },
  loadMoreButtonContainer: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
  },
}));

// TopTenCard내 Tabs컴포넌트 스타일
export const useTabs = makeStyles((theme: Theme) => createStyles({
  indicator: {
    display: 'none',
  },
  scroller: {
    overflow: 'visible',
  },
  root: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiTab-root': {
        minWidth: 'auto',
      },
    },
  },
}));

// https://mui-treasury.com/styles/tabs/
// TopTenCard내 ~~점수 Tab 컴포넌트 스타일 
export const useTabItem = makeStyles((theme: Theme) => {
  const defaultBgColor = theme.palette.background.paper;
  const defaultLabelColor = theme.palette.text.disabled;
  const svgFontSize = theme.typography.h4.fontSize;
  const rootHeight = theme.spacing(9);
  return createStyles({
    root: {
      textTransform: 'initial',
      height: rootHeight,
      minHeight: rootHeight,
      overflow: 'visible',
      position: 'relative',
      justifyContent: 'flex-start',
      paddingLeft: theme.spacing(3),
      '&:after': {
        content: '" "',
        display: 'none',
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
        backgroundColor: defaultBgColor,
        zIndex: 1,
      },
      '&$root:after': {
        display: 'block',
      },
      '& $wrapper': {
        color: theme.palette.primary.main,
      },
    },
    wrapper: {
      color: defaultLabelColor,
      position: 'relative',
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      flexDirection: 'row',
      width: 'auto',
      alignItems: 'center',
      '& svg': {
        fontSize: svgFontSize,
        marginRight: theme.spacing(0.5),
      },
      wordBreak: 'keep-all',
    },
  });
});
