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
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
// routes
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AdminAlarm from './pages/AdminAlarm';
import AdminNotice from './pages/AdminNotice';
import AdminCbt from './pages/AdminCbt';
import AdminSuggest from './pages/AdminSuggest';
import NoticeWrite from './pages/NoticeWrite';
import Sidebar from './organisms/Sidebar';
import AdminUsers from './pages/AdminUsers';
import UserBroadcast from './pages/UserBroadcast';
import Creator from './pages/Creator';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(relativeTime);

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
    padding: theme.spacing(3),
    marginTop: '70px',
    minHeight: 'calc(100vh - 123px)',
    width: `calc(100% - ${240}px)`,
  },
}));

const theme = createMuiTheme({ palette: { type: 'light' } });
const darkTheme = createMuiTheme({ palette: { type: 'dark' } });

export interface ListProps{
  index: number;
  name: string;
  description: string;
  path: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  component: () => JSX.Element;
}

export const routes: ListProps[] = [
  {
    index: 0,
    name: '공지사항 리스트',
    description: '공지사항 목록을 봅니다.',
    path: '/admin/notice',
    icon: ListIcon,
    component: AdminNotice,
  },
  {
    index: 1,
    name: '공지사항 글 작성',
    description: '공지사항글을 작성합니다.',
    path: '/admin/notice-write',
    icon: EditIcon,
    component: NoticeWrite,
  },
  {
    index: 2,
    name: '메시지보내기',
    description: '메시지를 보냅니다.',
    path: '/admin/alarm',
    icon: MessageIcon,
    component: AdminAlarm,
  },
  {
    index: 3,
    name: '기능제안',
    description: '기능제안 관리',
    path: '/admin/suggest',
    icon: EditIcon,
    component: AdminSuggest,
  },
  {
    index: 4,
    name: 'Cbt 관리',
    description: 'cbt 회원 관리',
    path: '/admin/cbt',
    icon: PersonAddIcon,
    component: AdminCbt,
  },
  {
    index: 5,
    name: '이용자 DB',
    description: '이용자 DB 정보를 봅니다',
    path: '/admin/users',
    icon: AssignmentIcon,
    component: AdminUsers,
  },
  {
    index: 6,
    name: '크리에이터 관리',
    description: '크리에이터 정보 처리',
    path: '/admin/creator',
    icon: AccessibilityNewIcon,
    component: Creator,
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

  const [darkModeToggle, setDarkModeToggle] = React.useState(false);
  function handleThemeChange() {
    setDarkModeToggle(!darkModeToggle);
  }
  return (
    <SnackbarProvider maxSnack={1} preventDuplicate>
      <ThemeProvider theme={darkModeToggle ? darkTheme : theme}>
        <CssBaseline />
        <Grid container className={classes.root}>

          <BrowserRouter>
            <Sidebar routes={routes} handleThemeChange={handleThemeChange} />

            <main className={classes.content}>
              <Switch>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} component={route.component} />
                ))}
                <Route exact path="/admin/user/:userId" component={UserBroadcast} />
              </Switch>
            </main>
          </BrowserRouter>
        </Grid>
      </ThemeProvider>
    </SnackbarProvider>
  );
}
