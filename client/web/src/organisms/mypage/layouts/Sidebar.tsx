import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
// @material-ui/core components
import {
  Grid, Drawer,
  List, ListItem, ListItemText, ListItemIcon, Icon
} from '@material-ui/core';
import { MypageRoute } from '../../../pages/mypage/routes';
// styles
import useSiedebarStyles from './Sidebar.style';

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

  const links = (
    <List className={classes.flex}>
      {routes.map((route) => (

        <NavLink
          to={route.layout + route.path}
          activeClassName="active"
          key={route.layout + route.path}
        >
          <ListItem button className={classes.itemLink}>
            <Grid container direction="column" className={classes.center}>
              <Grid item>
                {/* route.icon
                  && <ListItemIcon>{route.icon}</ListItemIcon> */}
                <ListItemText primary={route.name} disableTypography className={classes.itemText} />
              </Grid>
            </Grid>
          </ListItem>
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
          // classes={{ paper: classNames(classes.desktopPaper) }}
        PaperProps={{ elevation: 10 }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
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
