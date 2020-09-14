import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router, Switch, Route
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider, Paper, IconButton, Typography
} from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import THEME_TYPE from './interfaces/ThemeType';
import * as serviceWorker from './serviceWorker';
import defaultTheme from './theme';
import history from './history';
import './assets/global.css';
// Pages
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';
import HighlightAnalysis from './pages/mypage/HighlightAnalysis';

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

          {/* *********************************************** */}
          {/* Example changing Theme !! */}
          <Paper
            style={{
              height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <Typography variant="h4">
              트루포인트
            </Typography>

            {themeType === THEME_TYPE.DARK && (
              <IconButton color="primary" onClick={handleThemeChange}><Brightness4Icon /></IconButton>
            )}
            {themeType === THEME_TYPE.LIGHT && (
              <IconButton color="primary" onClick={handleThemeChange}><Brightness7Icon /></IconButton>
            )}

          </Paper>
          {/* This is Example */}
          {/* *********************************************** */}

          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route exact path="/highlightanalysis" component={HighlightAnalysis} />
            {/* <Route exact path="/introduction" component={서비스소개페이지} /> */}
            {/* 페이지 컴포넌트가 여기에 위치합니다. */}
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
