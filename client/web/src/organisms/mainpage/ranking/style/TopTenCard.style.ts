import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';

// TopTenCard 스타일
export const useTopTenCard = makeStyles((theme: Theme) => createStyles({
  topTenWrapper: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      border: 'none',
    },
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
    padding: theme.spacing(4, 0, 5, 1),
    marginBottom: theme.spacing(1),
    '&>:nth-child(1)': {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    '&>:nth-child(2)': {
      fontSize: theme.typography.h5.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
    },
  },
  loadMoreButtonContainer: {
    textAlign: 'center',
    padding: theme.spacing(2, 0),
  },
  loadMoreButton: {
    fontSize: theme.typography.body1.fontSize,
    border: `2px solid ${theme.palette.grey[500]}`,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.grey[500],
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
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
  const svgFontSize = theme.typography.body1.fontSize;
  const rootHeight = theme.spacing(5.5);
  return createStyles({
    root: {
      '&.MuiButtonBase-root': {
        textTransform: 'initial',
        height: rootHeight,
        minHeight: rootHeight,
        padding: 0,
        paddingLeft: theme.spacing(0.5),
        overflow: 'visible',
        position: 'relative',
        justifyContent: 'flex-start',
        minWidth: 'auto',
      },
    },
    selected: {
      '&$root': {
        filter: `drop-shadow(2px 2px 3px ${theme.palette.action.disabled}) drop-shadow(0px 0px 10px ${theme.palette.divider})`,
        backgroundColor: defaultBgColor,
        zIndex: 1,
      },
      '&$root $wrapper': {
        color: theme.palette.secondary.main,
      },
    },
    wrapper: {
      '&.MuiTab-wrapper': {
        color: defaultLabelColor,
        position: 'relative',
        fontSize: theme.typography.button.fontSize,
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

    },
  });
});

// ToptenCard 내 상단 가로형 탭 컴포넌트 스타일
export const useHorizontalTabsStyle = makeStyles((theme: Theme) => createStyles({
  indicator: {
    display: 'none',
  },
  root: {
    '&.MuiTabs-root': {
      display: 'inline-flex',
      backgroundColor: theme.palette.type === 'light' ? theme.palette.divider : theme.palette.background.default,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(0.25),
      minHeight: theme.spacing(3.75),
    },
  },
}));

// https://mui-treasury.com/styles/tabs/
// ToptenCard 내 상단 가로형 탭 아이템 컴포넌트 스타일
export const useHorizontalTabItemStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    '&.MuiButtonBase-root': {
      minWidth: theme.spacing(7.5),
      minHeight: theme.spacing(3.75),
      alignItems: 'center',
      opacity: 1,
      overflow: 'initial',
      padding: theme.spacing(0, 1),
      borderRadius: theme.spacing(1),
      color: theme.palette.text.primary,
      transition: '0.2s',
    },
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
    fontSize: theme.typography.button.fontSize,
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
    '&.MuiTabs-root': {
      padding: theme.spacing(0.5),
      marginBottom: theme.spacing(2.5),
      backgroundColor: theme.palette.type === 'light' ? theme.palette.divider : theme.palette.background.default,
      minHeight: 'auto',
    },
  },
  indicator: { display: 'none' },
}));
export const usePlatformTabItemStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    '&.MuiButtonBase-root': {
      minHeight: 'auto',
      minWidth: 'auto',
      height: theme.spacing(2),
      padding: theme.spacing(0, 1),
    },
  },
  wrapper: {
    fontSize: theme.typography.button.fontSize,
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
