import React from 'react';
import ReactDOM from 'react-dom';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import {  CssBaseline, ThemeProvider, createMuiTheme, Grid, makeStyles } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';

import {
  BrowserRouter, Switch, Route
} from 'react-router-dom';
//routes
import AdminAlarm from './pages/AdminAlarm';
import AdminNotice from './pages/AdminNotice';
import AdminSuggest from './pages/AdminSuggest';
import NoticeWrite from './pages/NoticeWrite';
import NoticeSidebar from './organisms/notice/NoticeSidebar';

const useStyles = makeStyles(theme => ({
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
    backgroundColor: theme.palette.background.default,
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
      path: '/admin_notice',
      icon: ListIcon
    },
    {
      index: 1,
      name: '공지사항 글 작성',
      description: '공지사항글을 작성합니다.',
      path: '/admin_notice_write',
      icon: EditIcon
    },
    {
      index: 2,
      name: '메시지보내기',
      description: '메시지를 보냅니다.',
      path: '/admin_message',
      icon: MessageIcon
    },
    {
      index: 3,
      name: '기능제안',
      description: '기능제안 관리',
      path: '/admin_suggest',
      icon: EditIcon
    },
];


export default function App(){

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container className={classes.root}>

      <BrowserRouter>
        <NoticeSidebar {...routes} /> 

        <main className={classes.content}>
          <div className={classes.selectBar} />
          <Switch>
            <Route exact path="/admin_notice" component={AdminNotice} />
            <Route exact path="/admin_alarm" component={AdminAlarm} />
            <Route exact path="/admin_suggest" component={AdminSuggest} />
            <Route exact path="/admin_notice_write" component={NoticeWrite} />
          </Switch>
        </main>
      </BrowserRouter>
      </Grid>
  </ThemeProvider>
  );
}

