import React, { useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {
  createStyles, makeStyles, useTheme,
} from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import {
  IconButton, Typography, Menu,
  MenuItem, Button, Hidden,
} from '@material-ui/core';
import {
  Dashboard, MoreVert,
  // ListAltOutlined,
  Brightness7 as LightThemeIcon,
  Brightness4 as DarkThemeIcon,
} from '@material-ui/icons';
import TruepointLogo from '../../atoms/TruepointLogo';
import TruepointLogoLight from '../../atoms/TruepointLogoLight';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { COMMON_APP_BAR_HEIGHT, SM_APP_BAR_HEIGHT } from '../../assets/constants';
import THEME_TYPE from '../../interfaces/ThemeType';
import { TruepointTheme } from '../../interfaces/TruepointTheme';
// type
import HeaderLinks from './sub/HeaderLinks';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
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
    backgroundColor: theme.palette.background.paper,
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
    color: theme.palette.text.primary,
    opacity: 0.8,
    '&:hover': { textShadow: '0 4px 8px rgba(0, 0, 0, 0.24)', opacity: 1 },
  },
  selected: { textShadow: '0 4px 8px rgba(0, 0, 0, 0.24)', opacity: 1, '& $linkText': { fontSize: theme.typography.h6.fontSize } },
  linkText: { fontWeight: 'bold' },
  logo: {
    width: 214,
    height: 74,
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

export default function AppBar(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();
  const theme = useTheme<TruepointTheme>();

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
  const links = [
    {
      name: '마이페이지', path: '/mypage/main', activeRouteString: '/mypage', hidden: !(authContext.user.userId.length > 1 && authContext.accessToken),
    },
    { name: '인방랭킹', path: '/ranking', activeRouteString: '/ranking' },
    { name: '유튜브 편집점', path: '/highlight-list', activeRouteString: '/highlight-list' },
    { name: '공지사항', path: '/notice', activeRouteString: '/notice' },
    { name: '기능제안', path: '/feature-suggestion', activeRouteString: '/feature-suggestion' },
    { name: '자유게시판', path: '/community-board', activeRouteString: '/community-board' },
  ];

  const darkModeToggleButtonContent = (
    <>
      <LightThemeIcon className={classes.lightModeIcon} />
      <DarkThemeIcon className={classes.darkModeIcon} />
    </>
  );

  const mobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {authContext.user.userId.length > 1 && authContext.accessToken && (
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
      {links.slice(1).map((link) => (
        <MenuItem
          key={link.path.slice(1)}
          className={classnames(classes.menuItem, classes.mobileText)}
          component={Link}
          to={link.path}
          button
        >
          <Typography>{link.name}</Typography>
        </MenuItem>
      ))}

      <MenuItem
        className={classnames(classes.menuItem, classes.mobileText, classes.darkModeToggleButton)}
        component={Button}
        onClick={theme.handleThemeChange}
        button
      >
        {darkModeToggleButtonContent}
      </MenuItem>

      {authContext.user.userId ? (
        <MenuItem className={classes.menuItem}>
          <div className={classes.userInterfaceWrapper}>
            <HeaderLinks />
          </div>
        </MenuItem>
      ) : (
        null
        // 트루포인트 2.0에서 로그인기능 사용하지 않아 로그인버튼 임시 주석처리
        // <MenuItem className={classes.menuItem}>
        //   <Button
        //     variant="contained"
        //     color="secondary"
        //     className={classes.loginButton}
        //     component={Link}
        //     to="/login"
        //   >
        //     로그인
        //   </Button>
        // </MenuItem>
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
                {links.map((link) => (
                  <div key={link.name}>
                    {!link.hidden && (
                    <Button
                      component={Link}
                      to={link.path}
                      className={classnames(classes.link, {
                        [classes.selected]: isActiveRoute(link.activeRouteString),
                      })}
                    >
                      <Typography className={classes.linkText}>{link.name}</Typography>
                    </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 트루포인트 2.0에서 로그인 기능 사용하지 않아 로그인버튼 임시 주석처리 */}
            {/* <div className={classes.links}>
              {authContext.user.userId && authContext.accessToken ? ( // 로그인 되어있는 경우
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
            </div> */}

            <div className={classes.links}>
              <IconButton
                className={classes.darkModeToggleButton}
                onClick={theme.handleThemeChange}
              >
                {darkModeToggleButtonContent}
              </IconButton>
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
