import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import {
  IconButton, Typography, Menu,
  MenuItem, Button,
} from '@material-ui/core';
import {
  Dashboard, MoreVert, ListAltOutlined,
  BeenhereOutlined,
} from '@material-ui/icons';
import TruepointLogo from '../../atoms/TruepointLogo';
import TruepointLogoLight from '../../atoms/TruepointLogoLight';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { COMMON_APP_BAR_HEIGHT, MYPAGE_MAIN_MAX_WIDTH, SM_APP_BAR_HEIGHT } from '../../assets/constants';
import THEME_TYPE from '../../interfaces/ThemeType';

// type
import HeaderLinks from './sub/HeaderLinks';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
    background: theme.palette.primary.main,
    position: 'fixed',
    width: '100%',
    zIndex: 1200,
  },
  container: {
    position: 'sticky',
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    height: COMMON_APP_BAR_HEIGHT,
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
    [theme.breakpoints.down('sm')]: {
      height: SM_APP_BAR_HEIGHT,
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
    },
  },
  links: {
    display: 'flex',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  link: {
    color: 'white', marginLeft: theme.spacing(2), marginRight: theme.spacing(4),
  },
  linkText: { fontWeight: 'bold' },
  logo: {
    margin: `0px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('sm')]: {
      width: 200,
      height: 28,
    },
  },
  appbarSpace: {
    paddingTop: COMMON_APP_BAR_HEIGHT,
    [theme.breakpoints.down('sm')]: {
      paddingTop: SM_APP_BAR_HEIGHT,
    },
  },
  userInterfaceWrapper: {
    display: 'flex',
    flex: 1,
  },
  loginButton: {
    height: '40px',
    fontSize: '24px',
    width: '120px',
    marginRight: theme.spacing(4),
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(0),
    },
  },
  leftspace: {
    [theme.breakpoints.down('sm')]: {
      width: 24,
      height: 24,
    },
  },
  mobileMenu: {
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuItem: {
    justifyContent: 'center',
  },
  mobileIcon: {
    marginRight: theme.spacing(1),
  },
  mobileText: {
    fontSize: '15px',
    fontWeight: theme.typography.fontWeightRegular,
  },
  mobileTextMyPage: {
    color: theme.palette.primary.main,
  },
}));

export default function AppBar(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLButtonElement>): void {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose(): void {
    setMobileMoreAnchorEl(null);
  }

  const mobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {authContext.user.userId.length > 1 && (
        <MenuItem className={classes.menuItem}>
          <Button
            className={classes.mobileTextMyPage}
            component={Link}
            to="/mypage/main"
          >
            <Dashboard className={classes.mobileIcon} />
            마이페이지
          </Button>
        </MenuItem>
      )}
      <MenuItem className={classes.menuItem}>
        <Button
          className={classes.mobileText}
          component={Link}
          to="/notice"
        >
          <ListAltOutlined className={classes.mobileIcon} />
          공지사항
        </Button>
      </MenuItem>
      <MenuItem className={classes.menuItem}>
        <Button
          className={classes.mobileText}
          component={Link}
          to="/feature-suggestion"
        >
          <BeenhereOutlined className={classes.mobileIcon} />
          기능제안
        </Button>
      </MenuItem>
      {authContext.user.userId ? (
        <MenuItem className={classes.menuItem}>
          <div className={classes.userInterfaceWrapper}>
            <HeaderLinks />
          </div>
        </MenuItem>
      ) : (
        <MenuItem className={classes.menuItem}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.loginButton}
            component={Link}
            to="/login"
          >
            로그인
          </Button>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <div className={classes.root}>
        <MuiAppBar className={classes.container}>
          <div className={classes.toolbar}>
            <div className={classes.leftspace} />
            {localStorage.getItem('themeType') === THEME_TYPE.LIGHT ? (
              <TruepointLogoLight className={classes.logo} />
            ) : (
              <TruepointLogo className={classes.logo} />
            )}
            <div className={classes.links}>
              <div>
                {authContext.user.userId.length > 1 && (
                <Button component={Link} to="/mypage/main" className={classes.link}>
                  <Typography className={classes.linkText} variant="h6">마이페이지</Typography>
                </Button>
                )}
                <Button component={Link} to="/notice" className={classes.link}>
                  <Typography className={classes.linkText} variant="h6">공지사항</Typography>
                </Button>
                <Button component={Link} to="/feature-suggestion" className={classes.link}>
                  <Typography className={classes.linkText} variant="h6">기능제안</Typography>
                </Button>
              </div>

              <div>
                {authContext.user.userId ? (
                  <div className={classes.userInterfaceWrapper}>
                    <HeaderLinks />
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.loginButton}
                    component={Link}
                    to="/login"
                  >
                    로그인
                  </Button>
                )}
              </div>
            </div>
            <div className={classes.mobileMenu}>
              <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen}>
                <MoreVert />
              </IconButton>
            </div>
          </div>
        </MuiAppBar>
        {mobileMenu}
      </div>
      <div className={classes.appbarSpace} />
    </>
  );
}
