import React from 'react';
import ReactDOM from 'react-dom';
import { AxiosResponse, AxiosError } from 'axios';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider,
} from '@material-ui/core';

import { configure } from 'axios-hooks';
import * as serviceWorker from './serviceWorker';
import axios from './utils/axios';

// styles
import defaultTheme from './theme';
import './assets/truepoint.css';
// Pages and organisms
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';
import Mypage from './pages/mypage/layouts/MypageLayout';
import KakaoTalk from './organisms/shared/KakaoTalkButton';
import Login from './pages/mainpage/Login';
import Regist from './pages/mainpage/Regist';
import FindId from './pages/others/FindId';
import FindPassword from './pages/others/FindPassword';
// hooks
import useTruepointThemeType from './utils/hooks/useTruepointThemeType';
import AuthContext, { useLogin } from './utils/contexts/AuthContext';
import { TruepointTheme } from './interfaces/TruepointTheme';

function Index(): JSX.Element {
  // *******************************************
  // Theme Configurations
  const { themeType, handleThemeChange } = useTruepointThemeType();
  const THEME = createMuiTheme({
    ...defaultTheme, palette: { ...defaultTheme.palette, type: themeType, },
  });
  const truepointTheme: TruepointTheme = { ...THEME, handleThemeChange };

  const {
    user, accessToken, handleLogout, handleLogin
  } = useLogin();

  // *******************************************
  // Axios Configurations

  // Response Interceptors
  function onResponseFulfilled(request: AxiosResponse): AxiosResponse {
    return request;
  }
  function onResponseRejected(err: AxiosError): any {
    if (err.response && err.response.status === 401) {
      // Unauthorized Error 인 경우
      return axios.post('/auth/silent-refresh')
        .then((res) => {
          const token = res.data.access_token;
          // 새로받은 access token을 axios 기본 헤더로 설정
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          // React Context 변경
          handleLogin(token);
          // 실패 요청을 재 요청
          const failedRequest = err.config;
          failedRequest.headers['cache-control'] = 'no-cache';
          return axios(failedRequest);
        })
        .catch(() => {
          window.location.href = '/';
          return Promise.reject(err); // 로그인으로 강제 이동
        });
    }
    return Promise.reject(err);
  }
  axios.interceptors.response.use(
    onResponseFulfilled, onResponseRejected
  );
  // axios-hooks configuration
  configure({ axios });

  // *******************************************
  // 자동로그인 체크하여 유효한 refresh token이 있는 경우 자동 로그인
  React.useLayoutEffect(() => {
    if (!user.userId) {
      console.log('refreshing!...');
      axios.post('/auth/silent-refresh')
        .then((res) => {
          if (res.data) {
            handleLogin(res.data.access_token);
            console.log('refreshed!...');
            // login, signup, find-id, find-pw인 경우 메인페이지로 이동
            if (['/login', '/signup', 'find-id', 'find-pw']
              .includes(window.location.pathname)) {
              window.location.href = '/';
            }
          }
        })
        .catch((err) => { console.log(err); });
    }
  }, []); // Should be run only once!!

  return (
    <ThemeProvider theme={truepointTheme}>
      <CssBaseline />

      {/* 로그인 여부 Context */}
      <AuthContext.Provider value={{
        user, accessToken, handleLogin, handleLogout
      }}
      >
        <KakaoTalk />
        {/* 페이지 컴포넌트 */}
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/signup" component={Regist} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/find-id" component={FindId} />
            <Route exact path="/find-pw" component={FindPassword} />

            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route path="/mypage" component={Mypage} />
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
