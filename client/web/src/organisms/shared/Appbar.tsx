import {
  Button, Hidden, IconButton, Menu, MenuList,
  MenuItem, Typography, Popover,
} from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';
import {
  createStyles, makeStyles, useTheme,
} from '@material-ui/core/styles';
import {
  Brightness4 as DarkThemeIcon,
  Brightness7 as LightThemeIcon, Dashboard, MoreVert,
} from '@material-ui/icons';
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMMON_APP_BAR_HEIGHT, SM_APP_BAR_HEIGHT } from '../../assets/constants';
import TruepointLogo from '../../atoms/TruepointLogo';
import { TruepointTheme } from '../../interfaces/TruepointTheme';
import useAuthContext from '../../utils/hooks/useAuthContext';
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
    // maxWidth: 
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create('background'),
  },
  transparent: {
    backgroundColor: 'transparent',
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
  linkItem: {
    position: 'relative',
  },
  link: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
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
      fontSize: theme.typography.h5.fontSize,
    },
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: theme.typography.h6.fontSize,
  },
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

const usePopoverStyles = makeStyles((theme) => ({
  popover: {
    position: 'relative',
    width: '100%',
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    pointerEvents: 'auto',
  },
}));

interface AppBarProps {
  variant?: 'transparent';
}

export default function AppBar({
  variant,
}: AppBarProps): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();
  const popoverStyles = usePopoverStyles();
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
    {
      name: '인방랭킹',
      path: '/ranking',
      activeRouteString: '/ranking',
      sub: [
        { name: '인방랭킹', path: '/ranking' },
        { name: '방송인검색', path: '/ranking/search' },
      ],
    },
    { name: '자유게시판', path: '/community-board', activeRouteString: '/community-board' },
    { name: '공지사항', path: '/notice', activeRouteString: '/notice' },
    { name: '기능제안', path: '/feature-suggestion', activeRouteString: '/feature-suggestion' },
    { name: '유튜브 편집점', path: '/highlight-list', activeRouteString: '/highlight-list' },
    { name: 'About us', path: '/about-us', activeRouteString: '/about-us' },
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
        link.sub ? [
          link.sub.map((subLink) => (
            <MenuItem
              key={subLink.path}
              className={classnames(classes.menuItem, classes.mobileText)}
              component={Link}
              to={subLink.path}
              button
            >
              <Typography>{subLink.name}</Typography>
            </MenuItem>
          )),
        ] : [
          <MenuItem
            className={classnames(classes.menuItem, classes.mobileText)}
            component={Link}
            to={link.path}
            button
          >
            <Typography>{link.name}</Typography>
          </MenuItem>,
        ]
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

  // 투명 앱바 (variant==='transparent') 인 경우에만.
  const [transparentDisabled, setTransparentDisabled] = useState<boolean>(false);
  const handleScroll = () => {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    if (windowScroll > COMMON_APP_BAR_HEIGHT) setTransparentDisabled(true);
    else setTransparentDisabled(false);
  };
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (variant === 'transparent') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  /**
   * 인방랭킹 하위 탭 
   * 현재 하나뿐(인방랭킹 - 방송인검색)이라 임시로 만듦
   * 추후 수정 필요
   */
  const popoverAnchor = useRef<any>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <div className={classes.root}>
        <MuiAppBar
          className={classnames(
            classes.container, {
              [classes.transparent]: variant === 'transparent' && !transparentDisabled,
            },
          )}
        >
          <div className={classes.toolbar}>
            {/* 모바일 화면을 위해 */}
            <Hidden mdUp>
              <div className={classes.leftspace} />
            </Hidden>
            <div className={classes.left}>
              <TruepointLogo className={classes.logo} />

              <div className={classes.links}>
                {links.map((link) => (
                  <div className={classes.linkItem} key={link.name}>
                    {!link.hidden && (
                      <>
                        <Button
                          ref={link.sub ? popoverAnchor : null}
                          component={Link}
                          to={link.path}
                          className={classnames(classes.link, {
                            [classes.selected]: isActiveRoute(link.activeRouteString),
                          })}
                          onClick={link.sub ? handlePopoverOpen : undefined}
                          onMouseEnter={link.sub ? handlePopoverOpen : undefined}
                          onMouseLeave={link.sub ? handlePopoverClose : undefined}
                        >
                          <Typography noWrap className={classes.linkText}>{link.name}</Typography>
                        </Button>
                        {/* 
                        인방랭킹 하위 탭 
                        현재 하나뿐(인방랭킹 - 방송인검색)이라 임시로 만듦
                        추후 수정 필요
                        */}
                        {link.sub && (
                        <Popover
                          className={popoverStyles.popover}
                          classes={{
                            paper: popoverStyles.paper,
                          }}
                          open={popoverOpen}
                          anchorEl={popoverAnchor.current}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          onClose={handlePopoverClose}
                          PaperProps={{ onMouseEnter: handlePopoverOpen, onMouseLeave: handlePopoverClose }}
                          disableScrollLock
                        >
                          <MenuList>
                            {link.sub.map((sub) => (
                              <MenuItem
                                key={sub.path}
                                component={Link}
                                to={sub.path}
                                button
                              >
                                {sub.name}
                              </MenuItem>
                            ))}
                          </MenuList>

                        </Popover>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

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

      {variant === 'transparent' ? (null) : (
        <div className={classes.appbarSpace} />
      )}
    </>
  );
}
