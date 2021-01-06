import React from 'react';
import { VideoListItemType } from '../VideoListTable';

// 썸네일 컴포넌트-------------------------------------------
export default function Thumbnail(data: VideoListItemType): JSX.Element {
  return <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />;
}
