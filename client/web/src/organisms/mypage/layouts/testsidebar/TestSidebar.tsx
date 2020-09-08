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
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import BorderLeftIcon from '@material-ui/icons/BorderLeft';
import { MypageRoute } from '../../../../pages/mypage/routes';
// styles
// import useSiedebarStyles from './Sidebar.style';
import useTestStyle from './TestSidebar.style';

interface SidebarProps {
  routes: MypageRoute[];
}

export default function TestSidebar({
  routes,
}: SidebarProps): JSX.Element {
  const classes = useTestStyle();
  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(pagePath: string): boolean {
    return window.location.pathname.indexOf(pagePath) > -1;
  }

  const selectedTabStyle = (pagePath: string, isIcon: boolean) => {
    if (!isIcon) {
      if (isActiveRoute(pagePath)) {
        return classes.selectedTab;
      }
      return classes.notSelectedTab;
    }

    if (isActiveRoute(pagePath)) {
      return classes.selectedIcon;
    }
    return classes.notSelectedIcon;
  };

  const links = (
    <List className={classes.listWrapper}>
      <Divider />
      {routes.map((route) => (
        <NavLink // 서브라우터 존재시 해당 상위 탭 클릭시 하위 탭 첫 번째 페이지를 default 로 설정
          to={route.subRoutes
            ? (route.subRoutes[0].layout + route.subRoutes[0].path)
            : (route.layout + route.path)}
          key={route.layout + route.path}
          style={{ textDecoration: 'none' }}
        >
          <ListItem
            key={route.name}
            className={classes.listText}
            disableGutters
            button
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
                    // classes={{
                    //   expanded: classes.active
                    // }}
                  >

                    <Grid container xs={12} direction="row" justify="flex-start">
                      <Grid item xs={1}>
                        {isActiveRoute(route.path) ? '|' : <div />}
                      </Grid>
                      <Grid item xs={3}>
                        {route.icon
                          ? (
                            <ListItemIcon
                              className={classes.listIconWrapper}
                            >
                              <route.icon className={selectedTabStyle(route.path, true)} />
                            </ListItemIcon>
                          )
                          : <div />}
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>
                          <Typography variant="h6" className={selectedTabStyle(route.path, false)}>
                            {route.name}
                          </Typography>
                        </ListItemText>
                      </Grid>
                    </Grid>

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
                              <ListItem button className={classes.subTabItem}>
                                <Grid container direction="column" spacing={0} justify="flex-start">
                                  <Grid item container direction="row" justify="flex-start">
                                    <ListItemIcon
                                      className={classes.listIconWrapper}
                                    >
                                      <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Typography variant="body1" className={selectedTabStyle(subroute.path, false)}>
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

      <Grid container direction="column" justify="center" className={classes.root}>
        <Grid item>
          {links}
        </Grid>
      </Grid>

    </div>
  );
}
