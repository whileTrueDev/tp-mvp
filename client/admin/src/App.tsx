import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { SnackbarProvider } from 'notistack';
import {
  CssBaseline, ThemeProvider, createMuiTheme, Grid, makeStyles,
} from '@material-ui/core';
// icons
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
// routes
import AdminAlarm from './pages/AdminAlarm';
import AdminNotice from './pages/AdminNotice';
import AdminCbt from './pages/AdminCbt';
import AdminSuggest from './pages/AdminSuggest';
import NoticeWrite from './pages/NoticeWrite';
import Sidebar from './organisms/Sidebar';
import AdminUsers from './pages/AdminUsers';
import UserBroadcast from './pages/UserBroadcast';

const useStyles = makeStyles((theme) => ({
  root: {

    overflow: 'auto',
    position: 'relative',
    float: 'right',
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  // toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    marginTop: '70px',
    minHeight: 'calc(100vh - 123px)',
    width: `calc(100% - ${240}px)`,
  },
  selectBar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const theme = createMuiTheme({

  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#90caf9',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#a8c4f9',
    },
  },
});

export interface ListProps{
  index: number;
  name: string;
  description: string;
  path: string;
  icon?: (props: SvgIconProps) => JSX.Element;
}

export const routes: ListProps[] = [
  {
    index: 0,
    name: '공지사항 리스트',
    description: '공지사항 목록을 봅니다.',
    path: '/admin/notice',
    icon: ListIcon,
  },
  {
    index: 1,
    name: '공지사항 글 작성',
    description: '공지사항글을 작성합니다.',
    path: '/admin/notice-write',
    icon: EditIcon,
  },
  {
    index: 2,
    name: '메시지보내기',
    description: '메시지를 보냅니다.',
    path: '/admin/alarm',
    icon: MessageIcon,
  },
  {
    index: 3,
    name: '기능제안',
    description: '기능제안 관리',
    path: '/admin/suggest',
    icon: EditIcon,
  },
  {
    index: 4,
    name: 'Cbt 관리',
    description: 'cbt 회원 관리',
    path: '/admin/cbt',
    icon: PersonAddIcon,
  },
  {
    index: 5,
    name: '이용자 DB',
    description: '이용자 DB 정보를 봅니다',
    path: '/admin/users',
    icon: AssignmentIcon,
  },
];

/*
App
**********************************************************************************
전체 App의 route를 설정하는 컴포넌트 입니다.
**********************************************************************************
1. AdminNotice, AdminAlarm, AdminSuggest, NoticeWrite, AdminCbt 페이지가 위치합니다.
**********************************************************************************
 */
export default function App(): JSX.Element {
  const classes = useStyles();

  return (
    <SnackbarProvider maxSnack={1} preventDuplicate>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container className={classes.root}>

          <BrowserRouter>
            <Sidebar routes={routes} />

            <main className={classes.content}>
              <div className={classes.selectBar} />
              <Switch>
                <Route exact path="/admin/notice" component={AdminNotice} />
                <Route exact path="/admin/alarm" component={AdminAlarm} />
                <Route exact path="/admin/suggest" component={AdminSuggest} />
                <Route exact path="/admin/notice-write" component={NoticeWrite} />
                <Route exact path="/admin/cbt" component={AdminCbt} />
                <Route exact path="/admin/users" component={AdminUsers} />
                <Route exact path="/admin/user/:userId" component={UserBroadcast} />
              </Switch>
            </main>
          </BrowserRouter>

        </Grid>
      </ThemeProvider>
    </SnackbarProvider>
  );
}
