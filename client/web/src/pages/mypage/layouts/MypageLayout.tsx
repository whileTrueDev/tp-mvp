import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';
// organisms
import AppBar from '../../../organisms/shared/Appbar';
import PageSizeAlert from '../../../organisms/mypage/alertbar/PageSizeAlert';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import MypageLoading from './MypageLoading';
import SidebarWithNavbar from '../../../organisms/mypage/layouts/sidebar-with-navbar/SidebarWithNavbar';

const UserDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();
  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  });

  // 화면 크기 관련 경고 알림창을 위한 스테이트
  const [alertOpen, setAlertOpen] = useState<boolean>();
  function handleAlertOpen() {
    setAlertOpen(true);
  }
  function handleAlertClose() {
    setAlertOpen(false);
  }

  /**
   * ************************************************
   * 토큰리프레시 로딩 컴포넌트 Open을 위한 작업
   */
  const auth = useAuthContext();
  const [loadingOpen, setLoadingOpen] = useState(auth.loginLoading === true || !auth.user.userId);
  useLayoutEffect(() => {
    const maxTimeout = 2 * 1000; // 2초
    if (!(!auth.loginLoading && auth.user.userId)) {
      setLoadingOpen(true);
    }

    const timer = setTimeout(() => {
      // 로딩이 끝났고, 유저 ID가 있는 경우(토큰이 있는 경우)
      if (!auth.loginLoading && auth.user.userId && auth.accessToken) setLoadingOpen(false);
      // 최대 타임아웃 이후에도 로딩이 끝나지 않았거나 액세스 토큰이 없는 경우 
      else window.location.href = '/login';
    }, maxTimeout);
    return () => clearTimeout(timer);
  }, [auth.accessToken, auth.loginLoading, auth.user.userId]);
  // *************************************************

  // *************************************************
  // 사이드바 오픈 스테이트
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* 최상단 네비바 */}
      <AppBar />

      {/* mypage 최소화면크기 이하 기기로 접속한 경우 알림 창 */}
      <PageSizeAlert
        open={alertOpen}
        handleOpen={handleAlertOpen}
        handleClose={handleAlertClose}
      />

      <div className={classes.wrapper}>
        {/* 마이페이지 상단 네비바 */}
        <SidebarWithNavbar
          routes={routes.filter((route) => !route.noTab)}
          open={open}
          handleOpen={handleDrawerOpen}
          handleClose={handleDrawerClose}
        />

        {/* 마이페이지 메인 패널 */}
        <main ref={mainPanel} className={classes.mainPanel}>
          <div className={classes.contents}>
            {(loadingOpen) ? (<MypageLoading />) : (
              <Switch>
                {routes.map((route) => (
                  route.nested
                    ? (
                      route.subRoutes && route.subRoutes.map((subRoute) => (
                        <Route
                          path={subRoute.layout + subRoute.path}
                          component={subRoute.component}
                          key={subRoute.name}
                        />
                      ))
                    ) : (
                      <Route
                        path={route.layout + route.path}
                        component={route.component}
                        key={route.name}
                      />
                    )
                ))}
              </Switch>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
