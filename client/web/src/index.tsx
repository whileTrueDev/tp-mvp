import 'moment/locale/ko';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider,
} from '@material-ui/core';
import { configure } from 'axios-hooks';
import { SnackbarProvider } from 'notistack';
import loadable from '@loadable/component';

import axios from './utils/axios';
import { onResponseFulfilled, makeResponseRejectedHandler } from './utils/interceptors/axiosInterceptor';
// styles
import defaultTheme from './theme';
import './assets/truepoint.css';
// hooks
import useTruepointThemeType from './utils/hooks/useTruepointThemeType';
import AuthContext, { useLogin } from './utils/contexts/AuthContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TruepointTheme } from './interfaces/TruepointTheme';

// Pages and organisms
import KakaoTalk from './organisms/shared/KakaoTalkButton';
import useAutoLogin from './utils/hooks/useAutoLogin';
// import Mypage from './pages/mypage/layouts/MypageLayout';

const Main = loadable(() => import('./pages/mainpage/Main'));
const PrivacyPolicy = loadable(() => import('./pages/others/PrivacyPolicy'));
const TermsOfUse = loadable(() => import('./pages/others/TermsOfUse'));
const PublickMypage = loadable(() => import('./pages/mainpage/PublicMypage'));
const Login = loadable(() => import('./pages/mainpage/Login'));
const Regist = loadable(() => import('./pages/mainpage/Regist'));
const FindId = loadable(() => import('./pages/others/FindId'));
const FindPassword = loadable(() => import('./pages/others/FindPassword'));
const FeatureSuggestion = loadable(() => import('./pages/mainpage/FeatureSuggestion'));
const FeatureSuggestionWrite = loadable(() => import('./pages/mainpage/FeatureSuggestionWrite'));
const CommunityBoard = loadable(() => import('./pages/mainpage/CommunityBoard'));
const PageNotFound = loadable(() => import('./pages/others/PageNotFound'));
const Ranking = loadable(() => import('./pages/mainpage/Ranking'));
const YoutubeHighlightList = loadable(() => import('./pages/mainpage/YoutubeHighlightList'));
const SearchCreator = loadable(() => import('./pages/mainpage/SearchCreator'));
const UserInfoPage = loadable(() => import('./pages/mypage/UserInfoPage'));
const Notice = loadable(() => import('./pages/mainpage/Notice'));

function Index(): JSX.Element {
  // *******************************************
  // Theme Configurations
  const { themeType, handleThemeChange } = useTruepointThemeType();
  const THEME = createMuiTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      type: themeType,
    },
  });
  const truepointTheme: TruepointTheme = { ...THEME, handleThemeChange };

  // *******************************************
  // 로그인 관련 변수 및 함수 세트 가져오기
  const {
    user, accessToken, handleLogout, handleLogin,
    loginLoading, handleLoginLoadingStart, handleLoginLoadingEnd, setUser,
  } = useLogin();
  /* subscribe 목록의 유저 전환 컨택스트 - CBT 주석 및 추후 User 와 병합 */
  // const {
  //   currUser,
  //   invalidSubscribeUserList, validSubscribeUserList, handleCurrTargetUser,
  //   handleLoginUserId, loading, error,
  // } = useSubscribe();

  // *******************************************
  // axios-hooks configuration
  // 토큰 자동 새로고침을 위한 인터셉터 설정
  axios.interceptors.response.use(
    onResponseFulfilled,
    makeResponseRejectedHandler(handleLogin, handleLoginLoadingStart, handleLoginLoadingEnd),
  );
  configure({ axios });

  // *******************************************
  // 자동로그인 훅. 반환값 없음. 해당 함수는 useLayoutEffect 만을 포함함.
  useAutoLogin(user.userId, handleLogin, handleLoginLoadingStart, handleLoginLoadingEnd);

  // *******************************************
  // 화면 렌더링시 최상단 으로 고정
  // useScrollTop();
  return (

    <ThemeProvider<TruepointTheme> theme={truepointTheme}>
      <CssBaseline />

      <SnackbarProvider maxSnack={1} preventDuplicate>

        {/* 로그인 여부 Context */}
        <AuthContext.Provider value={{
          user,
          accessToken,
          handleLogin,
          handleLogout,
          loginLoading,
          handleLoginLoadingStart,
          handleLoginLoadingEnd,
          setUser,
        }}
        >

          <KakaoTalk />
          {/* 페이지 컴포넌트 */}
          {/* <SubscribeContext.Provider value={{
            currUser,
            invalidSubscribeUserList,
            validSubscribeUserList,
            handleCurrTargetUser,
            handleLoginUserId,
            loading,
            error,
          }}
          > */}

          <BrowserRouter>

            <Switch>
              <Route exact path="/" component={Ranking} />
              <Route exact path="/about-us" component={Main} />
              <Route exact path="/signup" component={Regist} />
              <Route exact path="/signup/completed" component={Regist} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/find-id" component={FindId} />
              <Route exact path="/find-pw" component={FindPassword} />
              <Route exact path="/notice" component={Notice} />
              <Route exact path="/notice/:id" component={Notice} />
              <Route exact path="/feature-suggestion" component={FeatureSuggestion} />
              <Route exact path="/feature-suggestion/read/:id" component={FeatureSuggestion} />
              <Route exact path="/feature-suggestion/write" component={FeatureSuggestionWrite} />
              <Route exact path="/feature-suggestion/write/:id" component={FeatureSuggestionWrite} />
              <Route exact path="/privacypolicy" component={PrivacyPolicy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route path="/community-board" component={CommunityBoard} />
              <Route path="/ranking" component={Ranking} />
              <Route exact path="/creator-search" component={SearchCreator} />
              <Route exact path="/highlight-list" component={YoutubeHighlightList} />
              <Route path="/public-mypage/:type/:userId" component={PublickMypage} />
              {/* <Route path="/mypage" component={Mypage} /> */}
              <Route path="/mypage" component={UserInfoPage} />
              <Route component={PageNotFound} />
            </Switch>
            {/* 페이지 컴포넌트 */}
          </BrowserRouter>
          {/* </SubscribeContext.Provider> */}
        </AuthContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <Index />,
  // <UpdatingPage />,
  document.getElementById('root'),
);
