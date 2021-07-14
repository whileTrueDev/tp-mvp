import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
// 기존 마이페이지 레이아웃 스타일 차용
import useLayoutStyles from '../mypage/layouts/MypageLayout.style';
// 필요 컴뽀넌트
import routes from '../../organisms/mainpage/youtubeHighlight/publicMypage/publicRoutes';
import AppBar from '../../organisms/shared/Appbar';
import PageSizeAlert from '../../organisms/mypage/alertbar/PageSizeAlert';
import SidebarWithNavbar from '../../organisms/mypage/layouts/sidebar-with-navbar/SidebarWithNavbar';
import useAuthContext from '../../utils/hooks/useAuthContext';
import useDialog from '../../utils/hooks/useDialog';
import usePublicMainUser from '../../utils/hooks/usePublicMainUser';

export interface ParamTypes {
  userId: string
}

export default function PublicMypage(): JSX.Element {
  const classes = useLayoutStyles();
  const { userId } = useParams<ParamTypes>();
  const { setUser } = usePublicMainUser((state) => state);
  const auth = useAuthContext();
  const { open: alertOpen, handleOpen: handleAlertOpen, handleClose: handleAlertClose } = useDialog();

  // main ref
  const mainPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainPanel && mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }

    // 비로그인 시 유저 정보 조회 용도
    if (userId) {
      setUser(userId);
    }
  }, [auth, setUser, userId]);

  // 마운트시 한번만 실행 - 컴포넌트 언마운트시 user.userId 초기화 위함
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setUser(''), []);

  // 사이드바 오픈 스테이트
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const memoAppbar = useMemo(() => (<AppBar />), []);

  return (
    <>
      {/* 최상단 네비바 */}
      {memoAppbar}

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
          publicMode={userId}
        />

        {/* 마이페이지 메인 패널 */}
        <main ref={mainPanel} className={classes.mainPanel}>
          <div className={classes.contents}>
            <Switch>
              {routes.map((route) => (
                route.nested
                  ? (
                    route.subRoutes && route.subRoutes.map((subRoute) => (
                      <Route
                        path={`${subRoute.layout}${subRoute.path}`}
                        component={subRoute.component}
                        key={subRoute.name}
                      />
                    ))
                  ) : (
                    <Route
                      path={`${route.layout}${route.path}`}
                      component={route.component}
                      key={route.name}
                    />
                  )
              ))}
            </Switch>

          </div>
        </main>
      </div>
    </>
  );
}
