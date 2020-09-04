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

  return (
    <div className={classes.wrapper}>

      <Grid container justify="center" direction="row">
        <Grid container item xs={2} className={classes.listWrapper}>
          <Paper className={classes.listWrapper}>
            <TestSidebar routes={routes.filter((r) => !r.noTab)} />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <div className={classes.mainPanel} ref={mainPanel}>
            <Navbar
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
