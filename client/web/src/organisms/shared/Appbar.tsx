import React, { useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {
  createStyles, makeStyles, lighten, darken,
} from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import {
  IconButton, Typography, Menu,
  MenuItem, Button, Hidden,
} from '@material-ui/core';
import {
  Dashboard, MoreVert, ListAltOutlined,
  BeenhereOutlined,
} from '@material-ui/icons';
import TruepointLogo from '../../atoms/TruepointLogo';
import TruepointLogoLight from '../../atoms/TruepointLogoLight';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { COMMON_APP_BAR_HEIGHT, SM_APP_BAR_HEIGHT } from '../../assets/constants';
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
    height: COMMON_APP_BAR_HEIGHT,
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  left: { display: 'flex', alignItems: 'center' },
  links: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  link: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
    color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    opacity: 0.8,
    '&:hover': { textShadow: '0 4px 8px rgba(0, 0, 0, 0.24)', opacity: 1 },
  },
  selected: { textShadow: '0 4px 8px rgba(0, 0, 0, 0.24)', opacity: 1 },
  linkText: { fontWeight: 'bold' },
  logo: {
    width: 170,
    height: 24,
    margin: `0px ${theme.spacing(4)}px`,
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
    justifyContent: 'flex-end',
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
}));

export default function AppBar(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();

  // 현재 활성화된 탭을 구하는 함수
  function isActiveRoute(pagePath: string): boolean {
    return window.location.pathname.indexOf(pagePath) > -1;
  }

  // 모바일 메뉴 오픈 스테이트
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
        <MenuItem
          className={classnames(classes.menuItem, classes.mobileTextMyPage)}
          component={Link}
          to="/mypage/main"
          button
        >
          <Dashboard className={classes.mobileIcon} />
          <Typography>마이페이지</Typography>
        </MenuItem>
      )}
      <MenuItem
        className={classnames(classes.menuItem, classes.mobileText)}
        component={Link}
        to="/notice"
        button
      >
        <ListAltOutlined className={classes.mobileIcon} />
        <Typography>공지사항</Typography>
      </MenuItem>
      <MenuItem
        className={classnames(classes.menuItem, classes.mobileText)}
        component={Link}
        to="/feature-suggestion"
        button
      >
        <BeenhereOutlined className={classes.mobileIcon} />
        <Typography>기능제안</Typography>
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
            {/* 모바일 화면을 위해 */}
            <Hidden mdUp>
              <div className={classes.leftspace} />
            </Hidden>
            <div className={classes.left}>
              {localStorage.getItem('themeType') === THEME_TYPE.LIGHT ? (
                <TruepointLogoLight className={classes.logo} />
              ) : (
                <TruepointLogo className={classes.logo} />
              )}

              <div className={classes.links}>
                {authContext.user.userId.length > 1 && (
                <Button
                  component={Link}
                  to="/mypage/main"
                  className={classnames(classes.link, { [classes.selected]: isActiveRoute('/mypage/main') })}
                >
                  <Typography className={classes.linkText}>마이페이지</Typography>
                </Button>
                )}
                <Button
                  component={Link}
                  to="/notice"
                  className={classnames(classes.link, { [classes.selected]: isActiveRoute('/notice') })}
                >
                  <Typography className={classes.linkText}>공지사항</Typography>
                </Button>
                <Button
                  component={Link}
                  to="/feature-suggestion"
                  className={classnames(classes.link, { [classes.selected]: isActiveRoute('/feature-suggestion') })}
                >
                  <Typography className={classes.linkText}>기능제안</Typography>
                </Button>
              </div>
            </div>

            <div className={classes.links}>
              {authContext.user.userId ? ( // 로그인 되어있는 경우
                <div className={classes.userInterfaceWrapper}>
                  <HeaderLinks />
                </div>
              ) : ( // 로그인 되어있지 않은 경우
                <Button
                  disableElevation
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

            <Hidden mdUp>
              <div className={classes.mobileMenu}>
                <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen}>
                  <MoreVert />
                </IconButton>
              </div>
            </Hidden>
          </div>
        </MuiAppBar>
        {mobileMenu}
      </div>
      <div className={classes.appbarSpace} />
    </>
  );
}
