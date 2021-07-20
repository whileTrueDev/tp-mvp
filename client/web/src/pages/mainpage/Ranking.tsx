import React from 'react';
import {
  Route, Switch, useRouteMatch,
} from 'react-router-dom';
import CreatorDetails from '../../organisms/mainpage/ranking/CreatorDetails';
import RankingMain from '../../organisms/mainpage/ranking/RankingMain';

import PageNotFound from '../others/PageNotFound';

export default function Ranking(): JSX.Element {
  const { path } = useRouteMatch();

  return (

    <>
      <Switch>
        <Route exact path={path}>
          <RankingMain />
        </Route>

        {/* 최근 방송 목록 포함한 방송인 정보 페이지 */}
        <Route exact path={`${path}/creator/:creatorId`}>
          <CreatorDetails />
        </Route>

        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </>

  );
}
