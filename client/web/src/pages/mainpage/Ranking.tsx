import { Container } from '@material-ui/core';
import React, { useMemo } from 'react';
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';
import CreatorDetails from '../../organisms/mainpage/ranking/CreatorDetails';
import CreatorSearch from '../../organisms/mainpage/ranking/CreatorSearch';
import RankingMain from '../../organisms/mainpage/ranking/RankingMain';
import StreamEvaluation from '../../organisms/mainpage/ranking/StreamEvaluation';
import { useRankingPageLayout } from '../../organisms/mainpage/ranking/style/RankingPage.style';
import HeaderDecoration from '../../organisms/mainpage/ranking/sub/HeaderDecoration';
import useMediaSize from '../../utils/hooks/useMediaSize';

import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';

export default function Ranking(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const { path } = useRouteMatch();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const headerDecoration = useMemo(() => <HeaderDecoration />, []);
  const { isMobile } = useMediaSize();

  return (
    <div className={wrapper.background}>
      {memoAppbar}
      {!isMobile && headerDecoration}

      <Switch>
        <Route exact path={path}>
          <RankingMain />
        </Route>

        {/* 방송 정보를 포함한 방송인 정보 페이지 */}
        <Route exact path={`${path}/creator/:creatorId`}>
          <CreatorDetails />
        </Route>

        {/* 최근 방송 정보 섹션 */}
        <Route exact path={`${path}/stream/:streamId`}>
          <Container className={wrapper.container}>
            <StreamEvaluation />
          </Container>
        </Route>

        {/* 방송인 검색 페이지 */}
        <Route exact path={`${path}/search`}>
          <CreatorSearch />
        </Route>

        <Route>
          <Redirect to="/ranking" />
        </Route>
      </Switch>

      {memoFooter}
    </div>

  );
}
