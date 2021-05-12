import React from 'react';
import {
  Switch, Route, useRouteMatch, Redirect,
} from 'react-router-dom';
import CommunityBoardList from '../../organisms/mainpage/communityBoard/CommunityBoardList';
import CommunityPostView from '../../organisms/mainpage/communityBoard/CommunityPostView';
import CommunityPostWrite from '../../organisms/mainpage/communityBoard/CommunityPostWrite';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';

export default function CommunityBoard(): JSX.Element {
  const { path } = useRouteMatch();
  return (
    <CommunityBoardCommonLayout>
      <Switch>
        <Route exact path={`${path}`} component={CommunityBoardList} />
        <Route exact path={`${path}/:platform/view/:postId`} component={CommunityPostView} />
        <Route exact path={`${path}/:platform/write`} component={CommunityPostWrite} />
        <Route exact path={`${path}/:platform/write/:postId`} component={CommunityPostWrite} />
        <Route>
          <Redirect to="/community-board" />
        </Route>
      </Switch>
    </CommunityBoardCommonLayout>
  );
}
