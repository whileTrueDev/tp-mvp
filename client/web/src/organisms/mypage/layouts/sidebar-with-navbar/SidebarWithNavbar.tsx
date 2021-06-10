import classnames from 'classnames';
import React, { useState, useCallback } from 'react';
// material-ui components layout
import MuiAppBar from '@material-ui/core/AppBar';
import {
  Collapse,
  createStyles,
  Divider,
  Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar, Typography,
} from '@material-ui/core';
import {
  ChevronLeft, ExpandLess, ExpandMore, Menu,
} from '@material-ui/icons';
// import routes from '../routes';
import { Link, useHistory } from 'react-router-dom';
import { COMMON_APP_BAR_HEIGHT, SIDE_BAR_WIDTH } from '../../../../assets/constants';
import { MypageRoute } from '../../../../pages/mypage/routes';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import usePublicMainUser from '../../../../utils/hooks/usePublicMainUser';

const useStyles = makeStyles((theme) => createStyles({
  root: { display: 'flex' },
  appBar: {
    backgroundColor: theme.palette.primary.dark,
    marginTop: COMMON_APP_BAR_HEIGHT,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: SIDE_BAR_WIDTH,
    width: `calc(100% - ${SIDE_BAR_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  titleWrapper: { marginLeft: theme.spacing(2), [theme.breakpoints.down('xs')]: { marginLeft: 0 } },
  title: { textDecoration: 'underline' },
  menuButton: { marginRight: theme.spacing(4), [theme.breakpoints.down('xs')]: { marginRight: theme.spacing(2) } },
  hide: { display: 'none' },
  // **************************************
  // Drawer
  drawer: {
    width: SIDE_BAR_WIDTH, flexShrink: 0, whiteSpace: 'nowrap',
  },
  drawerPaper: {
    marginTop: COMMON_APP_BAR_HEIGHT,
  },
  drawerOpen: {
    width: SIDE_BAR_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  nested: { paddingLeft: theme.spacing(4) },
  inset: { marginLeft: theme.spacing(5) },
  selected: { color: theme.palette.text.primary, fontWeight: 'bold' },
}));

export interface SidebarWithNavbarProps {
  routes: MypageRoute[];
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  publicMode?: string;
}

export default function SidebarWithNavbar({
  routes,
  open,
  handleOpen,
  handleClose,
  publicMode,
}: SidebarWithNavbarProps): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const {user} = usePublicMainUser((state) => state);
  const history = useHistory();

  const currentUserId = user.userId || auth.user.userId;

  const goToUrl = useCallback((layout: string, path: string) => {
    let resultUrl;
    if (publicMode) {
      resultUrl = `${layout}${path}/${publicMode}`;
    } else {
      resultUrl = `${layout}${path}`;
    }
    return resultUrl;
  }, [publicMode]);

  // 현재 활성화된 탭을 구하는 함수
  function isActiveRoute(pagePath: string): boolean {
    return window.location.pathname.indexOf(pagePath) > -1;
  }

  const [nestOpenList, setNestOpen] = useState<string[]>(['/mypage/stream-analysis', '/mypage/my-office']);
  function handleToggle(route: string) {
    if (nestOpenList.length === 0) handleOpen();
    if (nestOpenList.includes(route)) {
      // 이미 열린 목록에 있는 경우 + 열려있는 탭이 현재 탭 인경우 열린 목록에서 삭제
      setNestOpen((prev) => prev.filter((p) => p !== route));
    } else setNestOpen((prev) => prev.concat(route));
  }
  function resetNestList() {
    setNestOpen([]);
  }

  // ******************************************
  // Sidebar 내부 컨텐츠
  const drawerContents = (
    <div>
      <div className={classes.toolbar}>
        <IconButton onClick={() => {
          handleClose(); resetNestList();
        }}
        >
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />

      <List component="nav" aria-labelledby="nested-list-subheader">
        {publicMode && (
          <ListItem
            button
            onClick={() => {
              history.push('/highlight-list');
            }}
          >
            <ListItemIcon>
              <ChevronLeft />
            </ListItemIcon>
            <ListItemText
              primary="목록으로 돌아가기"
            />
          </ListItem>
        )}
        {routes.map((route) => (
          <div key={route.layout + route.path}>
            {route.subRoutes ? ( // 하위탭이 있는 경우
              <div>
                <ListItem
                  button
                  selected={isActiveRoute(route.path)}
                  onClick={() => {
                    if (!open && route.subRoutes) {
                      history.push(goToUrl(route.subRoutes[0].layout, route.subRoutes[0].path));
                      handleOpen();
                    }
                    handleToggle(route.layout + route.path);
                  }}
                >
                  {route.icon && (
                    <ListItemIcon>
                      <route.icon className={classnames({ [classes.selected]: isActiveRoute(route.path) })} />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={route.name}
                    classes={{
                      primary: classnames({ [classes.selected]: isActiveRoute(route.path) }),
                    }}
                  />
                  {nestOpenList?.includes(route.layout + route.path) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {/* 하위 탭 */}
                {open && (
                <Collapse in={!!nestOpenList?.includes(route.layout + route.path)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {route.subRoutes.map((subRoute) => (
                      <ListItem
                        key={subRoute.layout + subRoute.path}
                        button
                        selected={isActiveRoute(subRoute.path)}
                        className={classes.nested}
                        component={Link}
                        to={goToUrl(subRoute.layout, subRoute.path)}
                      >
                        <ListItemText
                          className={classes.inset}
                          primary={subRoute.name}
                          classes={{
                            primary: classnames({ [classes.selected]: isActiveRoute(subRoute.path) }),
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                )}
              </div>
            ) : ( // 하위 탭이 없는 경우
              <ListItem
                selected={isActiveRoute(route.path)}
                button
                component={Link}
                to={goToUrl(route.layout, route.path)}
              >
                {route.icon && (
                  <ListItemIcon>
                    <route.icon className={classnames({ [classes.selected]: isActiveRoute(route.path) })} />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={route.name}
                  classes={{
                    primary: classnames({ [classes.selected]: isActiveRoute(route.path) }),
                  }}
                />
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <MuiAppBar
        elevation={1}
        position="fixed"
        color="secondary"
        className={classnames(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpen}
            edge="start"
            className={classnames(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <Menu />
          </IconButton>

          {/* 구독 유저 선택 - CBT 에서는 제거되는 기능. */}
          {currentUserId && (
          <Typography variant="h6" className={classes.titleWrapper}>
            <span className={classes.title}>{currentUserId}</span>
            &nbsp;
            <span>님</span>
          </Typography>
          )}

          {/* 구독 유저 선택  CBT 에서는 제거되는 기능. */}
          {/* <NavbarUserList /> */}
        </Toolbar>
      </MuiAppBar>

      {/* 데스크탑 사이드바 */}
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          className={classnames(classes.drawer, {
            [classes.drawerOpen]: open, [classes.drawerClose]: !open,
          })}
          classes={{
            paper: classnames({
              [classes.drawerPaper]: true,
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          {drawerContents}
        </Drawer>
      </Hidden>

      {/* 모바일 사이드바 */}
      <Hidden smUp>
        <Drawer
          container={window !== undefined ? () => window.document.body : undefined}
          variant="temporary"
          open={open}
          onClose={handleClose}
          classes={{ paper: classnames(classes.drawerPaper, classes.drawerOpen) }}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        >
          {drawerContents}
        </Drawer>
      </Hidden>
    </>
  );
}
