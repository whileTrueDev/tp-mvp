import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Switch, Route
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider,
} from '@material-ui/core';
import { configure } from 'axios-hooks';
import axios from './utils/axios';
import * as serviceWorker from './serviceWorker';
// styles
import THEME_TYPE from './interfaces/ThemeType';
import defaultTheme from './theme';
import './assets/global.css';
// Pages
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';
import Login from './pages/mainpage/Login';
import Regist from './pages/mainpage/Regist';

import FindId from './pages/others/FindId';
import FindPassword from './pages/others/FindPassword';

configure({ axios });
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
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/regist" component={Regist} />
            <Route exact path="/find-id" component={FindId} />
            <Route exact path="/find-pw" component={FindPassword} />
            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            {/* <Route exact path="/introduction" component={서비스소개페이지} /> */}
            {/* 페이지 컴포넌트가 여기에 위치합니다. */}
          </Switch>
        </BrowserRouter>

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
