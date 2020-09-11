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

interface NavUserInfoInterface{
  username : string;
  subscribePerioud: string;
  isSubscribe: boolean;
  subscribeStartAt: Date;
  subscribeEndAt: Date;
}

const UserDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Truepoint | mypage';
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  });

  // navUserInfoList 하드코딩
  const [navUserInfoList] = React.useState<NavUserInfoInterface[]>([
    {
      username: 'test1',
      subscribePerioud: '2019-09-01 ~ 2019-09-3',
      isSubscribe: true,
      subscribeStartAt: new Date('2019-09-01'),
      subscribeEndAt: new Date('2020-09-03')
    },
    {
      username: 'test2',
      subscribePerioud: '2019-09-01 ~ 2019-09-30',
      isSubscribe: true,
      subscribeStartAt: new Date('2019-09-01'),
      subscribeEndAt: new Date('2020-09-30')
    },
    {
      username: 'test3',
      subscribePerioud: '2019-09-01 ~ 2019-09-02',
      isSubscribe: true,
      subscribeStartAt: new Date('2019-09-01'),
      subscribeEndAt: new Date('2020-09-02')
    },
  ]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.conatiner}>
        <aside className={classes.sidebarWrapper}>
          <TestSidebar routes={routes.filter((r) => !r.noTab)} />
        </aside>
        <div ref={mainPanel} className={classes.mainPanel}>
          <nav className={classes.appbarWrapper}>
            <Navbar
              navUserInfoList={navUserInfoList}
              routes={routes}
            />
          </nav>
          <main>
            <Switch>
              {routes.map((route) => (
                route.component
                  ? (
                    <Route
                      path={route.layout + route.path}
                      component={route.component}
                      key={route.name}
                    />
                  ) : (
                    route.subRoutes && route.subRoutes.map((subRoute) => (
                      <Route
                        path={subRoute.layout + subRoute.path}
                        component={subRoute.component}
                        key={subRoute.name}
                      />
                    ))
                  )
              ))}

            </Switch>
          </main>
        </div>
      </div>
      <MypageFooter />
    </div>
  );
};

export default UserDashboard;
