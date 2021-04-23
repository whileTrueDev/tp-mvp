import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';

// TopTenCard 스타일
export const useTopTenCard = makeStyles((theme: Theme) => createStyles({
  topTenWrapper: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    position: 'relative',
    border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.shape.borderRadius,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  recentAnalysisDate: {
    position: 'absolute',
    transform: 'translateY(-100%)',
  },
  left: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.divider : theme.palette.background.paper,
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 2, 5, 2),
    marginBottom: theme.spacing(1),
    '&>:nth-child(1)': {
      fontSize: theme.typography.h4.fontSize,
    },
    '&>:nth-child(2)': {
      fontSize: theme.spacing(5.5),
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
    },
  },
  loadMoreButtonContainer: {
    textAlign: 'center',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
  },
  loadMoreButton: {
    fontSize: theme.typography.h5.fontSize,
    border: `2px solid ${theme.palette.grey[500]}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2, 5),
    color: theme.palette.grey[500],
  },
}));

// TopTenCard내 세로형 Tabs컴포넌트 스타일
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
// TopTenCard내 세로형 Tab Item컴포넌트 스타일 
export const useTabItem = makeStyles((theme: Theme) => {
  const defaultBgColor = theme.palette.type === 'light' ? theme.palette.background.paper : theme.palette.grey.A200;
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
        color: theme.palette.secondary.main,
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

// ToptenCard 내 상단 가로형 탭 컴포넌트 스타일
export const useHorizontalTabsStyle = makeStyles((theme: Theme) => createStyles({
  indicator: {
    display: 'none',
  },
  root: {
    display: 'inline-flex',
    height: theme.spacing(9),
    backgroundColor: theme.palette.type === 'light' ? theme.palette.divider : theme.palette.background.default,
    borderRadius: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

// https://mui-treasury.com/styles/tabs/
// ToptenCard 내 상단 가로형 탭 아이템 컴포넌트 스타일
export const useHorizontalTabItemStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    height: theme.spacing(8),
    alignItems: 'center',
    opacity: 1,
    overflow: 'initial',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: '0.2s',
  },
  selected: {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.type === 'light'
      ? theme.palette.background.paper
      : theme.palette.primary.main,
    '& $wrapper': {
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.common.white,
    },
  },
  wrapper: {
    zIndex: 2,
    width: 'auto',
    textTransform: 'initial',
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.text.disabled,
    flexDirection: 'row',
    alignItems: 'center',
    wordBreak: 'keep-all',
    '& svg': {
      display: 'none',
      marginRight: theme.spacing(0.5),
    },
  },
}));

export const usePlatformTabsStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.type === 'light' ? theme.palette.divider : theme.palette.background.default,
    minHeight: 'auto',
  },
  indicator: { display: 'none' },
}));
export const usePlatformTabItemStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 'auto',
    minWidth: 'auto',
    height: theme.spacing(3.5),
    padding: theme.spacing(0, 2),
  },
  wrapper: {
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.text.disabled,
  },
  selected: {
    backgroundColor: theme.palette.type === 'light'
      ? theme.palette.background.paper
      : theme.palette.primary.main,
    '& $wrapper': {
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.common.white,
    },
  },
}));
