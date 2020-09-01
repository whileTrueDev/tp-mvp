import React, { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../../../organisms/mypage/layouts/Sidebar';
// import Footer from '../../../organisms/mypage/layouts/Footer/Footer';
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';

const CreatorDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);

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

export default CreatorDashboard;
