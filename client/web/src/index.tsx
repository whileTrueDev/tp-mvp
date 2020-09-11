import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router, Switch, Route
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider,
} from '@material-ui/core';

import THEME_TYPE from './interfaces/ThemeType';
import * as serviceWorker from './serviceWorker';
import defaultTheme from './theme';
import history from './history';
import './assets/truepoint.css';
// Pages
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';

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
            <Route exact path="/" component={Main} />
            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
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
