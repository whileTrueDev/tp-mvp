import { Theme, makeStyles } from '@material-ui/core/styles';
import {
  COMMON_APP_BAR_HEIGHT, MYPAGE_APP_BAR_HEIGHT,
  MYPAGE_MAIN_MAX_WIDTH, MYPAGE_MAIN_MIN_HEIGHT,
  MYPAGE_MAIN_MIN_WIDTH, SIDE_BAR_WIDTH,
} from '../../../assets/constants';

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'sticky',
    minHeight: `calc(100vh - ${COMMON_APP_BAR_HEIGHT}px)`,
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  conatiner: {
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    minWidth: MYPAGE_MAIN_MIN_WIDTH,
    minHeight: MYPAGE_MAIN_MIN_HEIGHT,
    margin: '0 auto',
    display: 'flex',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.background.default,
  },
  sidebarWrapper: {
    position: 'fixed',
    height: '100%',
    width: SIDE_BAR_WIDTH,
    marginTop: MYPAGE_APP_BAR_HEIGHT,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    '&:hover': {
      overflowY: 'auto',
    },
  },
  appbarWrapper: {
    height: MYPAGE_APP_BAR_HEIGHT,
    width: '100%',
    position: 'fixed',
    zIndex: 9999,
  },
  mainPanel: {
    marginLeft: 230,
    marginTop: MYPAGE_APP_BAR_HEIGHT,
    width: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
  },
}));

export default useLayoutStyles;
