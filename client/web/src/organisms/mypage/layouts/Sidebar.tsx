import React from 'react';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import {
  Grid, Drawer,
  List, ListItem, ListItemText, ListItemIcon
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
  const links = (
    <List>
      {routes.map((route) => (
        <NavLink
          to={route.layout + route.path}
          // className={classes.item}
          activeClassName="active"
          key={route.layout + route.path}
        >
          <ListItem button>
            <Grid container direction="column">
              <Grid item>
                {route.icon && (
                  <ListItemIcon>{route.icon}</ListItemIcon>
                )}
                <ListItemText primary={route.name} disableTypography />
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
