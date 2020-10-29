import React, { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
// material-ui components layout
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';
// organisms
import Navbar from '../../../organisms/mypage/layouts/navbar/Navbar';
import TestSidebar from '../../../organisms/mypage/layouts/testsidebar/TestSidebar';
import MypageFooter from '../../../organisms/mypage/footer/MypageFooter';
import AppBar from '../../../organisms/shared/Appbar';

const UserDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  });

  return (
    <>
      {/* 최상단 네비바 */}
      <AppBar />
      <div className={classes.wrapper}>

        {/* 마이페이지 상단 네비바 */}
        <nav className={classes.appbarWrapper}>
          <Navbar routes={routes} />
        </nav>

        {/* 메인패널과 사이드바를 포함한 영역 */}
        <div className={classes.conatiner}>

          {/* 마이페이지 좌측 사이드바 */}
          <aside className={classes.sidebarPlaceholder} />
          <aside className={classes.sidebarWrapper}>
            <TestSidebar routes={routes.filter((r) => !r.noTab)} />
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
        <MypageFooter />
      </div>
    </>
  );
};

export default UserDashboard;
