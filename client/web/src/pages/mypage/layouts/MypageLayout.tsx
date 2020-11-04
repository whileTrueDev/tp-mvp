import React, { useEffect, useRef, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
// material-ui components layout
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';
// organisms
import Navbar from '../../../organisms/mypage/layouts/navbar/Navbar';
import Sidebar from '../../../organisms/mypage/layouts/sidebar/Sidebar';
import AppBar from '../../../organisms/shared/Appbar';
import PageSizeAlert from '../../../organisms/mypage/alertbar/PageSizeAlert';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import TruepointLogo from '../../../atoms/TruepointLogo';

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

  // token이 아직 없거나, refresh-token을 통해 새로운 access_token을 받아오고 있는 경우에 보여질 로딩 페이지
  // 짧아서, 기존의 LoadingComponent는 사용이 불가한 듯 보인다. 그냥 로고만 띡 나오는 지금도 나쁘지는 않은 듯.
  // @by dan, @when 2020. 11. 04.
  const auth = useAuthContext();
  if (!(!auth.loginLoading && auth.user.userId)) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <TruepointLogo />
      </div>
    );
  }

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
        <nav className={classes.appbarWrapper}>
          <Navbar routes={routes} />
        </nav>

        {/* 메인패널과 사이드바를 포함한 영역 */}
        <div className={classes.conatiner}>

          {/* 마이페이지 좌측 사이드바 */}
          <aside className={classes.sidebarWrapper}>
            <Sidebar routes={routes.filter((r) => !r.noTab)} />
          </aside>

          {/* 마이페이지 메인 패널 */}
          <main ref={mainPanel} className={classes.mainPanel}>
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
          </main>

        </div>
      </div>
    </>
  );
};

export default UserDashboard;
