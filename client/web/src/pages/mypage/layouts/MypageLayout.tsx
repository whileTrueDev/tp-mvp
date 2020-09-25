import React, { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
// use axios
import useAxios from 'axios-hooks';
// material-ui components layout
import routes from '../routes';
// css
import useLayoutStyles from './MypageLayout.style';
// organisms
import Navbar from '../../../organisms/mypage/layouts/navbar/Navbar';
import TestSidebar from '../../../organisms/mypage/layouts/testsidebar/TestSidebar';
import MypageFooter from '../../../organisms/mypage/footer/MypageFooter';

interface NavUserInfoInterface{
  userId : string;
  targetUserId: string;
  startAt : Date;
  endAt : Date;
}

const UserDashboard = (): JSX.Element => {
  const classes = useLayoutStyles();
  const [currUser, setCurrUser] = React.useState<string>('');
  const [validSubscribeUserList,
    setValidSubscribeUserList] = React.useState<NavUserInfoInterface[]>([]);

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  });

  const [
    {
      data: getSubscribeData,
      loading: getSubscribeLoading,
      error: getSubscribeError
    }, excuteGetSubscribeData] = useAxios<{
      validUserList:NavUserInfoInterface[],
      inValidUserList:NavUserInfoInterface[]}>({
        url: 'http://localhost:3000/users/subscribe-users',
        params: {
          userId: 'qjqdn1568' // logined user id
        }
      });

  const handleChangeCurrUser = (otherUser: string) => {
    setCurrUser(otherUser);
  };

  React.useEffect(() => {
    if (getSubscribeData && getSubscribeData.validUserList) {
      setValidSubscribeUserList(getSubscribeData.validUserList);
      if (getSubscribeData.validUserList[0]) {
        setCurrUser(getSubscribeData.validUserList[0].targetUserId);
      }
    }
    // if (getSubscribeData) { if (getSubscribeData && getSubscribeData[0]) 
    // { setCurrUser(getSubscribeData[0].targetUserId); } }
  }, [getSubscribeData]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.conatiner}>
        <aside className={classes.sidebarWrapper}>
          <TestSidebar routes={routes.filter((r) => !r.noTab)} />
        </aside>
        <div ref={mainPanel} className={classes.mainPanel}>
          <nav className={classes.appbarWrapper}>
            <Navbar
              navUserInfoList={validSubscribeUserList}
              routes={routes}
              loading={getSubscribeLoading}
              error={getSubscribeError}
              handleChangeCurrUser={handleChangeCurrUser}
              userId="qjqdn1568"
            />
          </nav>
          <main>
            <Switch>
              {routes.map((route) => (
                !route.nested
                  ? (
                    <Route
                      path={route.layout + route.path}
                      component={() => route.component(currUser)}
                      key={route.name}
                    />
                  ) : (
                    route.subRoutes && route.subRoutes.map((subRoute) => (
                      <Route
                        path={subRoute.layout + subRoute.path}
                        component={() => subRoute.component(currUser)}
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
