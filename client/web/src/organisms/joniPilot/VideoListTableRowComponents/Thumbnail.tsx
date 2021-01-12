import React, { memo } from 'react';
import { VideoListItemType } from '../VideoListTable';

// 썸네일 컴포넌트-------------------------------------------
function Thumbnail(prop: VideoListItemType): JSX.Element {
  const { data } = prop;
  return <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />;
}

export default memo(Thumbnail);
