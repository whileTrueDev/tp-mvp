import React, { useEffect, useRef, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
// material-ui components layout
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Sidebar from '../../../organisms/mypage/layouts/sidebars/Sidebar';
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';
// organisms
import Navbar from '../../../organisms/mypage/layouts/navbars/Navbar';
import TestSidebar from '../../../organisms/mypage/layouts/testsidebar/TestSidebar';

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    document.title = 'Truepoint | mypage';
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  });

  // navUserInfoList 하드코딩
  const [navUserInfoList, setNavUserInfoList] = React.useState<NavUserInfoInterface[]>([
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

      <Grid container justify="center" direction="row">
        <Grid container item xs={2} className={classes.listWrapper}>
          <Paper className={classes.listWrapper}>
            <TestSidebar routes={routes.filter((r) => !r.noTab)} />
          </Paper>
        </Grid>
        <Grid item xs={9} alignContent="center" className={classes.mainPanel} ref={mainPanel}>
          <div>
            <Navbar
              navUserInfoList={navUserInfoList}
              handleDrawerToggle={handleDrawerToggle}
              routes={routes}
            />
            <div className={classes.content}>
              <div className={classes.container}>
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
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserDashboard;
