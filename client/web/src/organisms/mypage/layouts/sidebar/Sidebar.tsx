import React from 'react';
import classnames from 'classnames';
import { Link, NavLink } from 'react-router-dom';
// @material-ui/core components
import {
  Grid,
  List, ListItem, ListItemText, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails, Divider,
  Typography, Button,
} from '@material-ui/core';
// @material-ui/icons icon
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MaximizeIcon from '@material-ui/icons/Maximize';

import { MypageRoute } from '../../../../pages/mypage/routes';
// styles
import useSidebarStyle from './Sidebar.style';

interface SidebarProps {
  routes: MypageRoute[];
}

export default function Sidebar({
  routes,
}: SidebarProps): JSX.Element {
  const classes = useSidebarStyle();
  // verifies if routeName is the one active (in browser input)
  function isActiveRoute(pagePath: string): boolean {
    return window.location.pathname.indexOf(pagePath) > -1;
  }

  return (
    <List className={classes.conatiner}>
      {routes.map((route) => (
        <div key={route.name}>
          <ListItem
            key={route.name}
            className={classes.listItem}
            disableGutters
            // button
          >
            <Grid container item direction="column">
              <Accordion square className={classes.accordian}>
                <NavLink // 서브라우터 존재시 해당 상위 탭 클릭시 하위 탭 첫 번째 페이지를 default 로 설정
                  to={route.subRoutes
                    ? (route.subRoutes[0].layout + route.subRoutes[0].path)
                    : (route.layout + route.path)}
                  key={route.layout + route.path}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <AccordionSummary className={classes.accordianHeader}>

                    <Grid container direction="row" justify="flex-start">
                      <Grid item xs={1}>
                        {isActiveRoute(route.path) && (
                        <MaximizeIcon className={classes.selectedIndicator} />
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        {route.icon && (
                        <ListItemIcon>
                          <route.icon className={classnames({
                            [classes.icon]: true,
                            [classes.selected]: isActiveRoute(route.path),
                          })}
                          />
                        </ListItemIcon>
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>
                          <Typography
                            variant="h6"
                            className={classnames({
                              [classes.selected]: isActiveRoute(route.path),
                              [classes.notSelectedTab]: !isActiveRoute(route.path),
                            })}
                          >
                            {route.name}
                          </Typography>
                        </ListItemText>
                      </Grid>
                    </Grid>

                  </AccordionSummary>
                </NavLink>
                {/* 서브라우터가 존재 하는 경우 */}
                {route.subRoutes && (
                <AccordionDetails className={classes.subRouteList}>
                  {route.subRoutes.map((subroute) => (
                    <Link
                      key={subroute.layout + subroute.path}
                      className={classes.subRouteLink}
                      to={subroute.layout + subroute.path}

                    >
                      <Button
                        style={{ padding: 0, width: '100%', justifyContent: 'flex-start' }}
                      >
                        <ArrowForwardIosIcon
                          fontSize="small"
                          className={classnames({
                            [classes.selectedSubRouteIcon]: isActiveRoute(subroute.path),
                            [classes.notSelectedSubRouteIcon]: !isActiveRoute(subroute.path),
                          })}
                        />
                        <Typography
                          variant="body1"
                          className={classnames({
                            [classes.selected]: isActiveRoute(subroute.path),
                            [classes.notSelectedTab]: !isActiveRoute(subroute.path),
                          })}
                        >
                          {subroute.name}
                        </Typography>
                      </Button>

                    </Link>

                  ))}
                </AccordionDetails>

                )}
              </Accordion>

            </Grid>

          </ListItem>
          <Divider />
        </div>
        // </Link>
      ))}
    </List>
  );
}
