import { Theme, makeStyles } from '@material-ui/core/styles';
import {
  MYPAGE_APP_BAR_HEIGHT,
  MYPAGE_MAIN_MAX_WIDTH, MYPAGE_MAIN_MIN_HEIGHT,
  MYPAGE_MAIN_MIN_WIDTH, SIDE_BAR_WIDTH,
} from '../../../assets/constants';

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'sticky',
    display: 'flex',
    minHeight: MYPAGE_MAIN_MIN_HEIGHT,
    minWidth: MYPAGE_MAIN_MIN_WIDTH,
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  sidebarWrapper: {
    position: 'fixed',
    height: '100%',
    width: SIDE_BAR_WIDTH,
    marginTop: MYPAGE_APP_BAR_HEIGHT,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    '&:hover': { overflowY: 'auto' },
    zIndex: theme.zIndex.drawer,
  },
  mainPanel: {
    marginTop: MYPAGE_APP_BAR_HEIGHT,
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
  },
  contents: {
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    height: '100%',
    // margin: '0 auto',
  },
}));

export default useLayoutStyles;
