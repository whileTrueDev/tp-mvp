import {
  createStyles, makeStyles,
} from '@material-ui/core/styles';
import {
  COMMON_APP_BAR_HEIGHT, SM_APP_BAR_HEIGHT, MAX_WIDTH_DESKTOP,
} from '../../../assets/constants';

export const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%',
    zIndex: 1200,
  },
  container: {
    height: COMMON_APP_BAR_HEIGHT,
    maxWidth: MAX_WIDTH_DESKTOP,
    left: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create('background'),
    [theme.breakpoints.down('sm')]: {
      height: SM_APP_BAR_HEIGHT,
      backgroundColor: theme.palette.primary.main,
    },
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  toolbar: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    minWidth: '100%',
  },
  left: { display: 'flex', alignItems: 'center' },
  right: { display: 'flex', alignItems: 'center' },
  links: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  linkItem: {
    position: 'relative',
  },
  link: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.primary,
    opacity: 0.8,
    '&:hover': {
      textShadow: theme.shadows[7],
      opacity: 1,
    },
  },
  selected: {
    textShadow: theme.shadows[7],
    opacity: 1,
    '& $linkText': {
      textDecoration: 'underline',
      transform: 'scale(1.1)',
    },
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: theme.typography.body1.fontSize,
  },
  logo: {
    width: 112,
    height: 38,
    margin: `0px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('sm')]: {
      width: 80,
      height: 32,
    },
  },
  appbarSpace: {
    paddingTop: COMMON_APP_BAR_HEIGHT,
    [theme.breakpoints.down('sm')]: { paddingTop: SM_APP_BAR_HEIGHT },
  },
  userInterfaceWrapper: { display: 'flex', flex: 1 },
  loginButton: {
    marginRight: theme.spacing(4),
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(0),
    },
  },
  leftspace: {
    [theme.breakpoints.down('sm')]: {
      width: 24, height: 24,
    },
  },
  mobileMenu: {
    position: 'absolute',
    right: 0,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuItem: {
    justifyContent: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  mobileIcon: { marginRight: theme.spacing(1) },
  mobileText: {
    fontSize: '15px',
    fontWeight: theme.typography.fontWeightRegular,
  },
  mobileTextMyPage: { color: theme.palette.primary.main },
  darkModeToggleButton: {
    position: 'relative',
    color: theme.palette.text.primary,
    '&$menuItem': {
      width: '100%',
      borderTop: `2px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
    },
  },
  lightModeIcon: {
    display: theme.palette.type === 'light' ? 'none' : 'block',
  },
  darkModeIcon: {
    display: theme.palette.type === 'dark' ? 'none' : 'block',
  },

}));
