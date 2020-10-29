import { Theme, makeStyles } from '@material-ui/core/styles';

const SIDE_BAR_WIDTH = 230; // 사이드바 너비
const APP_BAR_HEIGHT = 96; // 상단 네비바 높이

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'sticky',
    minHeight: 'calc(100vh - 100px)',
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  conatiner: {
    maxWidth: 1816,
    minWidth: 1400,
    margin: '0 auto',
    minHeight: 1094,
    display: 'flex',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.background.default,
  },
  sidebarPlaceholder: {
    minWidth: SIDE_BAR_WIDTH,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    top: 0,
  },
  sidebarWrapper: {
    position: 'fixed',
    width: SIDE_BAR_WIDTH,
    paddingTop: APP_BAR_HEIGHT * 2,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    top: 0,
  },
  appbarWrapper: {
    height: APP_BAR_HEIGHT,
    width: '100%',
    position: 'fixed',
    zIndex: 9999,
  },
  mainPanel: {
    marginTop: APP_BAR_HEIGHT,
    width: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
  },
}));

export default useLayoutStyles;
