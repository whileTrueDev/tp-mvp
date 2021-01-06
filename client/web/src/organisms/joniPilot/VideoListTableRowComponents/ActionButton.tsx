import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import {
  Button,
} from '@material-ui/core';
import { VideoListItemType } from '../VideoListTable';

// 액션버튼(router link)--------------------------------
function RouterLinkButton(prop: VideoListItemType) {
  const { data } = prop;
  const { url } = useRouteMatch();
  return (
    <Button
      variant="contained"
      component={RouterLink}
      color="secondary"
      to={{
        pathname: `${url}/videos/${data.streamId}`,
        state: { data },
      }}
    >
      분석하기
    </Button>
  );
}
export default function ActionButtonComponent(data: VideoListItemType): JSX.Element {
  return <RouterLinkButton data={data} />;
}
