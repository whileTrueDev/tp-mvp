import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
// @material-ui/core components
import {
  Grid,
  List, ListItem, ListItemText, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails, Divider,
  Typography,

} from '@material-ui/core';
// @material-ui/icons icon
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MaximizeIcon from '@material-ui/icons/Maximize';
import { MypageRoute } from '../../../../pages/mypage/routes';
// styles
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

  return (
    <List className={classes.conatiner}>
      {routes.map((route) => (
        <Link // 서브라우터 존재시 해당 상위 탭 클릭시 하위 탭 첫 번째 페이지를 default 로 설정
          to={route.subRoutes
            ? (route.subRoutes[0].layout + route.subRoutes[0].path)
            : (route.layout + route.path)}
          key={route.layout + route.path}
          style={{ textDecoration: 'none' }}
        >
          <ListItem
            key={route.name}
            className={classes.listItem}
            disableGutters
            button
          >
            <Grid container item direction="column">
              <Accordion square className={classes.accordian}>
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
                          [classes.selected]: isActiveRoute(route.path)
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

                {/* 서브라우터가 존재 하는 경우 */}
                {route.subRoutes && (
                <AccordionDetails className={classes.subRouteList}>
                  {route.subRoutes.map((subroute) => (
                    <div
                      key={subroute.layout + subroute.path}
                      className={classes.subRouteLink}
                    >
                      <ArrowForwardIosIcon color="primary" fontSize="small" />
                      <Typography
                        variant="body1"
                        className={classnames({
                          [classes.selected]: isActiveRoute(subroute.path),
                          [classes.notSelectedTab]: !isActiveRoute(subroute.path),
                        })}
                        to={subroute.layout + subroute.path}
                        component={Link}
                      >
                        {subroute.name}
                      </Typography>
                    </div>
                  ))}
                </AccordionDetails>
                )}
              </Accordion>
            </Grid>
          </ListItem>
          <Divider />
        </Link>
      ))}
    </List>
  );
}
