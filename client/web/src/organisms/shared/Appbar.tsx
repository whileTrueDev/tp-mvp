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
import { TruepointTheme } from '../../interfaces/TruepointTheme';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { useStyles } from './styles/Appbar.style';
import DarkModeToggleButtonContent from './sub/DarkModeToggleButtonContent';
import MobileMenu from './sub/MobileMenu';
import MobileNavigation from './sub/MobileNavigation';

interface AppBarProps {
  variant?: 'transparent';
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
  const links = [
    {
      name: '마이페이지', path: '/mypage/main', activeRouteString: '/mypage', hidden: !(authContext.user.userId.length > 1 && authContext.accessToken),
    },
    { name: '인방랭킹', path: '/ranking', activeRouteString: ['/ranking', '/'] },
    { name: '방송인검색', path: '/creator-search', activeRouteString: '/creator-search' },
    { name: '자유게시판', path: '/community-board', activeRouteString: '/community-board' },
    { name: '공지사항', path: '/notice', activeRouteString: '/notice' },
    { name: '기능제안', path: '/feature-suggestion', activeRouteString: '/feature-suggestion' },
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
              <TruepointLogo className={classes.logo} />

              <div className={classes.links}>
                {links.map((link) => (
                  <div className={classes.linkItem} key={link.name}>
                    {!link.hidden && (
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

      <div className={classes.appbarSpace} />
      <MobileNavigation />
    </>
  );
}
