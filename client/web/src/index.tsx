import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider, Paper, IconButton, Typography
} from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import history from './history';
import * as serviceWorker from './serviceWorker';
import THEME_TYPE from './interfaces/ThemeType';
import defaultTheme from './theme';
import './assets/global.css';

function Index(): JSX.Element {
  // ******************************************************************
  // Dark/Light theme changing
  const [themeType, setTheme] = React.useState<THEME_TYPE>(THEME_TYPE.LIGHT);
  function handleThemeChange() {
    if (themeType === THEME_TYPE.DARK) setTheme(THEME_TYPE.LIGHT);
    else setTheme(THEME_TYPE.DARK);
  }
  const THEME = createMuiTheme({
    ...defaultTheme,
    palette: { ...defaultTheme.palette, type: themeType, },
  });

  return (
    <React.StrictMode>
      <ThemeProvider theme={THEME}>
        <CssBaseline />

        {/* 페이지 컴포넌트 */}

        <Router history={history}>
          <Switch>
            {/* <Route exact path="/" component={메인페이지} /> */}
            {/* <Route exact path="/introduction" component={서비스소개페이지} /> */}
            {/* 페이지 컴포넌트가 여기에 위치합니다. */}

            {/* *********************************************** */}
            {/* Example changing Theme !! */}
            <Paper
              style={{
                height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <div>
                <Typography variant="h4">
                  트루포인트
                </Typography>

                {themeType === THEME_TYPE.DARK && (
                <IconButton color="primary" onClick={handleThemeChange}><Brightness4Icon /></IconButton>
                )}
                {themeType === THEME_TYPE.LIGHT && (
                <IconButton color="primary" onClick={handleThemeChange}><Brightness7Icon /></IconButton>
                )}
              </div>
            </Paper>
            {/* This is Example */}
            {/* *********************************************** */}

          </Switch>
        </Router>

      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
