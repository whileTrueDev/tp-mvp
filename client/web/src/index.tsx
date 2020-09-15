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
import defaultTheme from './theme';
import './assets/global.css';
// Pages and organisms
import Appbar from './organisms/shared/Appbar';
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';
import Mypage from './pages/mypage/layouts/MypageLayout';
import Login from './pages/mainpage/Login';
import Regist from './pages/mainpage/Regist';
import FindId from './pages/others/FindId';
import FindPassword from './pages/others/FindPassword';
// hooks
import useTruepointThemeType from './utils/hooks/useTruepointThemeType';
import AuthContext, { useLogin } from './utils/contexts/AuthContext';

// axios-hooks configuration
configure({ axios });
function Index(): JSX.Element {
  const {
    user, accessToken, handleLogout, handleLogin
  } = useLogin();
  const { themeType, handleThemeChange } = useTruepointThemeType();
  const THEME = createMuiTheme({
    ...defaultTheme,
    palette: { ...defaultTheme.palette, type: themeType, },
  });

  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />

      {/* 로그인 여부 Context */}
      <AuthContext.Provider value={{
        user, accessToken, handleLogin, handleLogout
      }}
      >
        {/* 페이지 컴포넌트 */}
        <BrowserRouter>
          <Appbar themeType={themeType} handleThemeChange={handleThemeChange} />

          <Switch>

            <Route exact path="/" component={Main} />
            <Route exact path="/signup" component={Regist} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/find-id" component={FindId} />
            <Route exact path="/find-pw" component={FindPassword} />
            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />

            <Route exact pate="/mypage" component={Mypage} />
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
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
