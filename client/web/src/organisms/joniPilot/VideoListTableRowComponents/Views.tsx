import React, {memo} from 'react';
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

export default function ViewsComponent(data: VideoListItemType): JSX.Element {
  return <Typography>{formattingViewCount(data.views)}</Typography>;
}
