import { makeStyles, Theme } from '@material-ui/core/styles';
import { MYPAGE_MAIN_MAX_WIDTH, MYPAGE_MAIN_MIN_WIDTH, SIDE_BAR_WIDTH } from '../../../../assets/constants';

const useNavbarStyles = makeStyles((theme: Theme) => ({
  appBarWrapper: {
    margin: '0 auto',
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    minWidth: MYPAGE_MAIN_MIN_WIDTH,
    height: '100%',
  },
  appBar: {
    height: '100%',
    padding: 0,
    margin: 0,
    boxShadow: 'none',
    position: 'relative',
    display: 'block',
    zIndex: 1200,
    backgroundColor: theme.palette.primary.dark,
  },
  sidebarPlaceholder: {
    minWidth: SIDE_BAR_WIDTH,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  container: {
    paddingRight: '0px',
    paddingLeft: '0px',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100%',
    padding: 0,
  },
  title: {
    textTransform: 'none',
    fontWeight: 'bold',
    lineHeight: '100%',
    textDecoration: 'underline',
    marginRight: theme.spacing(1),
  },
  leftGridIcon: {
    fontSize: '32px',
    marginTop: theme.spacing(1),
  },
  rightGridIcon: {
    fontSize: '32px',
  },
  useNameButton: {
    padding: 0,
    height: '100%',
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
  subscribePeriod: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'underline',
    color: theme.palette.common.white,
  },
  subscribeChip: {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
  },
  notSubscribeChip: {
    background: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
  },
  userListWrapper: {
    display: 'flex',
    flex: 1,
    marginLeft: theme.spacing(6),
  },
  headerLinkWrapper: {
    paddingRight: theme.spacing(4),
    margin: 0,
  },
}));

export default useNavbarStyles;
