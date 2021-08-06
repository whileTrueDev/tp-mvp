import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  CssBaseline, ThemeProvider,
} from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import loadable from '@loadable/component';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
// styles
import defaultTheme from './theme';
import './assets/truepoint.css';
// hooks
import useTruepointThemeType from './utils/hooks/useTruepointThemeType';
import { AuthContextProvider } from './utils/contexts/AuthContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TruepointTheme } from './interfaces/TruepointTheme';

// Pages and organisms
import KakaoTalk from './organisms/shared/KakaoTalkButton';
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
  // 화면 렌더링시 최상단 으로 고정
  // useScrollTop();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: process.env.NODE_ENV === 'production',
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        refetchOnReconnect: process.env.NODE_ENV === 'production',
        refetchOnMount: process.env.NODE_ENV === 'production',
      },
    },
  });
  return (

    <ThemeProvider<TruepointTheme> theme={truepointTheme}>
      <CssBaseline />

      <SnackbarProvider maxSnack={1} preventDuplicate>
        <QueryClientProvider client={queryClient}>
          {/* 로그인 여부 Context */}
          <AuthContextProvider>
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
          </AuthContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <Index />,
  document.getElementById('root'),
);
