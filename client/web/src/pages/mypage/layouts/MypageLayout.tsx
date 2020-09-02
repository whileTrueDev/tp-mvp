import React, { useEffect, useRef, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../../../organisms/mypage/layouts/Sidebar';
// import Footer from '../../../organisms/mypage/layouts/Footer/Footer';
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';

// organisms
import Navbar from '../../../organisms/mypage/layouts/navbars/Navbar';

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
      <Sidebar routes={routes.filter((r) => !r.noTab)} />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          routes={routes}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {routes.map((route) => (
                <Route
                  path={route.layout + route.path}
                  component={route.component}
                  key={route.name}
                />
              ))}
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
