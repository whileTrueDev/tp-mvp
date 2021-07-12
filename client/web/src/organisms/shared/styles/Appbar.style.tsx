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
    justifyContent: 'center',
    flexDirection: 'row',
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
    backgroundColor: theme.palette.type === 'light'
      ? theme.palette.primary.main
      : theme.palette.background.default,
    transition: theme.transitions.create('background'),
    [theme.breakpoints.down('sm')]: {
      height: SM_APP_BAR_HEIGHT,
      backgroundColor: theme.palette.primary.main,
    },
  },
  transparent: {
    backgroundColor: 'transparent',
    '& $link': {
      color: theme.palette.text.primary,
    },
  },
  toolbar: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    minWidth: MAX_WIDTH_DESKTOP,
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },

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
    color: theme.palette.primary.contrastText,
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
    color: 'inherit',
    marginRight: theme.spacing(4),
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(0),
    },
  },
  mobileToggleLoginButton: {
    width: '100%',
    padding: theme.spacing(1.5),
    fontSize: theme.typography.body1.fontSize,
    borderRadius: theme.spacing(3.5),
  },
  mobileToggleLogoutButton: {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
  },
  leftspace: {
    [theme.breakpoints.down('sm')]: {
      width: 0, height: 0,
    },
  },
  mobileMenuButton: {
    position: 'absolute',
    right: 0,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileMenuCloseButton: {
    position: 'absolute',
    right: 0,
  },
  mobileMenuProfileImage: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  mobileMenuProfileName: {
    padding: theme.spacing(0, 1),
    textDecoration: 'none',
    display: 'block',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  menuItem: {
    width: theme.spacing(40),
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    '&.active': {
      color: theme.palette.primary.main,
    },
  },
  mobileIcon: { marginRight: theme.spacing(1) },
  mobileText: {
    fontSize: '15px',
    fontWeight: theme.typography.fontWeightRegular,
  },
  mobileTextMyPage: { color: theme.palette.primary.main },
  darkModeToggleButton: {
    position: 'relative',
    color: 'inherit',
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
  mobileToggleList: {
  },

}));
