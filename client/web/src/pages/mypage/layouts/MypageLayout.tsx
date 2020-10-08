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
      <AppBar />
      <div className={classes.wrapper}>
        <div className={classes.conatiner}>
          <aside className={classes.sidebarWrapper}>
            <TestSidebar routes={routes.filter((r) => !r.noTab)} />
          </aside>
          <div ref={mainPanel} className={classes.mainPanel}>
            <nav className={classes.appbarWrapper}>
              <Navbar routes={routes} />
            </nav>
            <main>
              <Switch>
                {routes.map((route) => (
                  route.nested
                    ? (
                      route.subRoutes && route.subRoutes.map((subRoute) => (
                        <Route
                          path={route.layout + route.path}
                          component={route.component}
                          key={route.name}
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
        <MypageFooter />
      </div>
    </>
  );
};

export default UserDashboard;
