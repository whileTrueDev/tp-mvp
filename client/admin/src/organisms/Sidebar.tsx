import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import classnames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, NavLink } from 'react-router-dom';
import { ListProps, routes } from '../App';
import {IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import { RouterSharp } from '@material-ui/icons';

const drawerWidth = 240;

//style정의
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
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
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  brand: {
    color: '#333',
    textDecoration: 'none',
  },
  upperLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkButton: {
    '&:hover': {
      color: theme.palette.secondary.main,
    },
    paddingLeft: theme.spacing(4),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.common.black,
  },
}));

//사이드바 드로어에서 선택된 페이지의 인덱스를 처리
function useDrawerSelectedItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  function handleListItemClick(evt: any, index: any) {
    setSelectedIndex(index);
  }
  return { selectedIndex, handleListItemClick };
}

/*
sidebar의 프롭스
routes: 사이드바에있는 메뉴의 목록
location: 현재 클릭된 페이지의위치 
 */
interface Props {
  routes: ListProps[];
  location: any;
}


export default function Sidebar(props: Props):JSX.Element {
  
  const {routes, location} = props;
  const classes = useStyles();
  const { selectedIndex, handleListItemClick } = useDrawerSelectedItem();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  function makeTitle() {
    let routeName = '';
    routes.forEach((route) => {
      if(route.index===selectedIndex){
        routeName = route.name;
      }
    });
    return `${routeName}`;
  }
 
  return (
    <div >
      <AppBar position="fixed"  className={classnames(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}>
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => { setDrawerOpen(true); }}
            edge="start"
            className={classnames(classes.menuButton, {
              [classes.hide]: drawerOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
           <Typography variant="h6" noWrap>
            {makeTitle()}
          </Typography> 
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        className={classnames(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: classnames({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
        open={drawerOpen}
        anchor="left"
      >
     <div className={classes.toolbar}>
          <Typography variant="h6" component={Link} to="/" className={classes.brand}>TruePoint 관리자</Typography>
          <IconButton onClick={() => { setDrawerOpen(false); }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />

        <List component="div" disablePadding>
        {routes.map( route => (
                <NavLink
                  to={route.path}
                  key={route.name}
                  className={classes.link}
                >
                  <ListItem
                    className={classes.linkButton}
                    button
                    selected={selectedIndex === route.index}
                    onClick={evt => handleListItemClick(evt, route.index)}
                  >
                    {route.icon && (
                      <ListItemIcon>
                        <route.icon/>
                        </ListItemIcon>
                         )}
                    <ListItemText
                      primary={route.name}
                      secondary={route.description}
                      secondaryTypographyProps={{
                        noWrap: true,
                      }}
                    />
                  </ListItem>
                </NavLink>
              ))}
          </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
        </Typography>
      </main>
    </div>
  );
}
