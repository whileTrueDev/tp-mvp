import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
// @material-ui/core components
import {
  Grid, Drawer,
  List, ListItem, ListItemText, ListItemIcon, Icon,
  Accordion, AccordionSummary, AccordionDetails, Divider,
  Typography, Paper, Button

} from '@material-ui/core';
import { MypageRoute } from '../../../../pages/mypage/routes';
// styles
import useSiedebarStyles from './Sidebar.style';
import useTestStyle from './Test.style';

interface SidebarProps {
  routes: MypageRoute[];
}

export default function Sidebar({
  routes,
}: SidebarProps): JSX.Element {
  const classes = useSiedebarStyles();
  function isActiveRoute(routeName: string): boolean {
    return window.location.pathname.indexOf(routeName) > -1;
  }

  const handleTabClick = (routeName: string) => {
    console.log('clicked');
  };

  const links = (
    <List>
      <Divider />
      {routes.map((route) => (
        <NavLink // 서브라우터 존재시 해당 상위 탭 클릭시 하위 탭 첫 번째 페이지를 default 로 설정
          to={route.subRoutes
            ? (route.subRoutes[0].layout + route.subRoutes[0].path)
            : (route.layout + route.path)}
          activeClassName="active"
          key={route.layout + route.path}
          style={{ textDecoration: 'none' }}
        >
          <ListItem
            key={route.name}
            className={classes.listText}
            button
            disableGutters
            selected
          >

            <Grid container direction="column">
              <Grid item>
                <Accordion
                  square
                  className={classes.accordian}
                >
                  <AccordionSummary
                    className={classes.accordianHeader}
                  >
                    {route.icon
                      ? (
                        <ListItemIcon
                          className={classes.listIcon}
                        >
                          <route.icon />
                        </ListItemIcon>
                      )
                      : <div />}
                    <ListItemText>
                      <Typography variant="h6">
                        {route.name}
                      </Typography>
                    </ListItemText>
                  </AccordionSummary>
                  {/* 서브라우터가 존재 하는 경우 */}
                  {route.subRoutes
                    ? (

                      <AccordionDetails className={classes.listText}>
                        <List>
                          {route.subRoutes.map((subroute) => (
                            <NavLink
                              to={subroute.layout + subroute.path}
                              activeClassName="active"
                              key={subroute.layout + route.path}
                              className={classes.accordianList}
                              style={{ textDecoration: 'none', color: 'black' }}
                            >
                              <ListItem button className={classes.subTabActive}>
                                <Grid container direction="column">
                                  <Grid item>
                                    <ListItemText>
                                      <Typography variant="body1">
                                        {subroute.name}
                                      </Typography>
                                    </ListItemText>
                                  </Grid>
                                </Grid>
                              </ListItem>
                            </NavLink>

                          ))}
                        </List>
                      </AccordionDetails>
                    )
                    : (<></>)}
                </Accordion>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
        </NavLink>

      ))}
    </List>
  );

  return (
    <div>
      {/* 데스크탑 사이드바 */}
      <Drawer
        variant="permanent"
        open
        // className={classes.sidebarWrapper}
        PaperProps={{ elevation: 10 }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={classes.drawerPaper}
      >
        {/* 사이드바 Logo */}
        <Grid container direction="column">
          <Grid item>
            {links}
          </Grid>
        </Grid>
      </Drawer>
    </div>
  );
}
