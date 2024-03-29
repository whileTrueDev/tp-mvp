import {
  Button, Hidden, IconButton, Typography,
} from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';
import { useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMMON_APP_BAR_HEIGHT } from '../../assets/constants';
import TruepointLogo from '../../atoms/TruepointLogo';
import AvatarWithName from '../../atoms/User/AvatarWithName';
import { TruepointTheme } from '../../interfaces/TruepointTheme';
import useAnchorEl from '../../utils/hooks/useAnchorEl';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { useStyles } from './styles/Appbar.style';
import DarkModeToggleButtonContent from './sub/DarkModeToggleButtonContent';
import MobileMenu from './sub/MobileMenu';
import MobileNavigation from './sub/MobileNavigation';
import UserMenuPopper from './sub/UserMenuPopover';

interface AppBarProps {
  variant?: 'transparent';
  appbarSpace?: boolean;
  mobileNavigation?: boolean;
}
// 현재 활성화된 탭을 구하는 함수
export function isActiveRoute(pagePath: string | string[]): boolean {
  if (Array.isArray(pagePath)) {
    return pagePath.includes(window.location.pathname);
  }
  return window.location.pathname.indexOf(pagePath) > -1;
}

export default function AppBar({
  variant,
  appbarSpace = true,
  mobileNavigation = true,
}: AppBarProps): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();
  const theme = useTheme<TruepointTheme>();

  // 모바일 메뉴 오픈 스테이트
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  function handleMobileMenuOpen(event: React.MouseEvent<HTMLButtonElement>): void {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  function handleMobileMenuClose(): void {
    setMobileMoreAnchorEl(null);
  }

  // 유저메뉴 팝오버 스테이트
  const {
    open, anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();

  const isLoggedIn = authContext.user.userId.length > 1 && authContext.accessToken;
  const links = [
    { name: '인방랭킹', path: '/ranking', activeRouteString: ['/ranking', '/'] },
    { name: '방송인검색', path: '/creator-search', activeRouteString: '/creator-search' },
    // tp 서비스 축소 및 유지보수 최소화를 위해 자유게시판, 공지사항, 기능제안 게시판 닫음 21.09.27 @Joni 
    // { name: '자유게시판', path: '/community-board', activeRouteString: '/community-board' },
    // { name: '공지사항', path: '/notice', activeRouteString: '/notice' },
    // { name: '기능제안', path: '/feature-suggestion', activeRouteString: '/feature-suggestion' },
    { name: '유튜브 편집점', path: '/highlight-list', activeRouteString: '/highlight-list' },
    { name: 'About us', path: '/about-us', activeRouteString: '/about-us' },
  ];

  const darkModeToggleButtonContent = <DarkModeToggleButtonContent />;

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
              <TruepointLogo
                type={variant === 'transparent' && !transparentDisabled ? 'light' : 'white'}
                className={classes.logo}
              />

              <div className={classes.links}>
                {links.slice(0, 5).map((link) => (
                  <div className={classes.linkItem} key={link.name}>
                    <>
                      <Button
                        component={Link}
                        to={link.path}
                        className={classnames(classes.link, {
                          [classes.selected]: isActiveRoute(link.activeRouteString),
                        })}
                      >
                        <Typography noWrap className={classes.linkText}>{link.name}</Typography>
                      </Button>
                    </>
                  </div>
                ))}
              </div>
            </div>

            <div className={classes.right}>
              <div className={classes.links}>
                {links.slice(5).map((link) => (
                  <div className={classes.linkItem} key={link.name}>
                    <>
                      <Button
                        component={Link}
                        to={link.path}
                        className={classnames(classes.link, {
                          [classes.selected]: isActiveRoute(link.activeRouteString),
                        })}
                      >
                        <Typography noWrap className={classes.linkText}>{link.name}</Typography>
                      </Button>
                    </>
                  </div>
                ))}

                {
                  isLoggedIn
                    ? (
                      <>
                        <Button onClick={handleAnchorOpen}>
                          <AvatarWithName
                            logo={authContext.user.profileImage}
                            name={authContext.user.nickName}
                          />
                        </Button>
                        <UserMenuPopper
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleAnchorClose}
                          avatarSrc={authContext.user.profileImage}
                        />
                      </>
                    )
                    : (
                      <>
                        <IconButton
                          className={classnames(classes.darkModeToggleButton, classes.link)}
                          onClick={theme.handleThemeChange}
                        >
                          {darkModeToggleButtonContent}
                        </IconButton>
                        <Button
                          className={classnames(classes.loginButton, classes.link)}
                          component={Link}
                          to="/login"
                          variant="outlined"
                        >
                          로그인
                        </Button>
                      </>
                    )
                }
              </div>

            </div>

            <Hidden mdUp>
              <div className={classes.mobileMenuButton}>
                <IconButton className={classes.link} aria-haspopup="true" onClick={handleMobileMenuOpen}>
                  <MenuIcon />
                </IconButton>
              </div>
            </Hidden>
          </div>
        </MuiAppBar>
        <MobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          handleMobileMenuClose={handleMobileMenuClose}
          links={links}
        />
      </div>

      {/* 투명앱바가 아닌경우 appbarSpace(패딩)적용 */}
      {(variant !== 'transparent' && !transparentDisabled)
      && appbarSpace
      && <div className={classes.appbarSpace} />}

      {/* 모바일 화면에서 나오는 단축메뉴(인방랭킹, 방송인검색, 자유게시판) */}
      {mobileNavigation && <MobileNavigation />}
    </>
  );
}
