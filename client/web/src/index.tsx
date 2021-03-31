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
import axios from './utils/axios';
import { onResponseFulfilled, makeResponseRejectedHandler } from './utils/interceptors/axiosInterceptor';
// styles
import defaultTheme from './theme';
// Pages and organisms
import Main from './pages/mainpage/Main';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import TermsOfUse from './pages/others/TermsOfUse';
import Mypage from './pages/mypage/layouts/MypageLayout';
import PublickMypage from './pages/mainpage/PublicMypage';
import KakaoTalk from './organisms/shared/KakaoTalkButton';
import Login from './pages/mainpage/Login';
import Regist from './pages/mainpage/Regist';
import FindId from './pages/others/FindId';
import FindPassword from './pages/others/FindPassword';
import FeatureSuggestion from './pages/mainpage/FeatureSuggestion';
import FeatureSuggestionWrite from './pages/mainpage/FeatureSuggestionWrite';
import CommunityBoardList from './pages/mainpage/CommunityBoardList';
import CommunityPostView from './pages/mainpage/CommunityPostView';
import CommunityPostWrite from './pages/mainpage/CommunityPostWrite';
// hooks
import useTruepointThemeType from './utils/hooks/useTruepointThemeType';
import AuthContext, { useLogin } from './utils/contexts/AuthContext';
import { TruepointTheme } from './interfaces/TruepointTheme';
import Notice from './pages/mainpage/Notice';
// import useAutoLogin from './utils/hooks/useAutoLogin';
// import SubscribeContext, { useSubscribe } from './utils/contexts/SubscribeContext';

import './assets/truepoint.css';
import PageNotFound from './pages/others/PageNotFound';
import Ranking from './pages/mainpage/Ranking';
import YoutubeHighlightList from './pages/mainpage/YoutubeHighlightList';

function Index(): JSX.Element {
  // *******************************************
  // Theme Configurations
  const { themeType, handleThemeChange } = useTruepointThemeType();
  const THEME = createMuiTheme({
    ...defaultTheme, palette: { ...defaultTheme.palette, type: themeType },
  });
  const truepointTheme: TruepointTheme = { ...THEME, handleThemeChange };

  // *******************************************
  // 로그인 관련 변수 및 함수 세트 가져오기
  const {
    user, accessToken, handleLogout, handleLogin,
    loginLoading, handleLoginLoadingStart, handleLoginLoadingEnd,
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

  // 트루포인트 2.0 에서 로그인 기능이 없어서 임시 주석처리함
  // useAutoLogin(user.userId, handleLogin, handleLoginLoadingStart, handleLoginLoadingEnd);

  // *******************************************
  // 화면 렌더링시 최상단 으로 고정
  // useScrollTop();
  return (

    <ThemeProvider<TruepointTheme> theme={truepointTheme}>
      <CssBaseline />

      <SnackbarProvider maxSnack={1} preventDuplicate>

        {/* 로그인 여부 Context */}
        <AuthContext.Provider value={{
          user, accessToken, handleLogin, handleLogout, loginLoading, handleLoginLoadingStart, handleLoginLoadingEnd,
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
              <Route exact path="/" component={Main} />
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
              <Route exact path="/community-board" component={CommunityBoardList} />
              <Route exact path="/community-board/:platform/view/:postId" component={CommunityPostView} />
              <Route exact path="/community-board/:platform/write" component={CommunityPostWrite} />
              <Route exact path="/community-board/:platform/write/:postId" component={CommunityPostWrite} />
              <Route path="/ranking" component={Ranking} />
              <Route exact path="/highlight-list" component={YoutubeHighlightList} />
              <Route path="/public-mypage/:type/:userId" component={PublickMypage} />
              <Route path="/mypage" component={Mypage} />
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
  document.getElementById('root'),
);
