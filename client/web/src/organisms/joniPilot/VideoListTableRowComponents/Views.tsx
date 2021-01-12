import React, { memo } from 'react';
import {
  Typography,
} from '@material-ui/core';
import { VideoListItemType } from '../VideoListTable';

// 조회수 컴포넌트-------------------------------------
function formattingViewCount(viewCount: number) {
  if (viewCount < 10000) {
    return viewCount;
  }
  return `${(viewCount / 10000).toFixed(2)} 만`;
}

function Views(prop: VideoListItemType): JSX.Element {
  const { data } = prop;
  return <Typography>{formattingViewCount(data.views)}</Typography>;
}

export default memo(Views);
