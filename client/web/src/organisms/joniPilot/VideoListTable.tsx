import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import MaterialTable from '../../atoms/Table/MaterialTable';

export interface VideoListItemType {
  [key: string]: any
}
function formattingViewCount(viewCount: number) {
  if (viewCount < 10000) {
    return viewCount;
  }
  return `${(viewCount / 10000)} 만`;
}
function ThumbnailComponent(data: VideoListItemType): JSX.Element {
  return <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />;
}
function InfoComponent(data: VideoListItemType): JSX.Element {
  return (
    <div>
      <div>
        <span>{data.title}</span>
        <Rating name="video-rating" value={data.rating} readOnly />
      </div>
      <div>{new Date(data.endDate).toISOString().split('T')[0]}</div>
    </div>
  );
}
function LikesComponent(data: VideoListItemType): JSX.Element {
  return (
    <p>
      <span>👍좋아요</span>
      &nbsp;
      <span>{data.likes}</span>
    </p>
  );
}
function ViewsComponent(data: VideoListItemType): JSX.Element {
  return <p>{formattingViewCount(data.views)}</p>;
}

function ActionButtonComponent(data: VideoListItemType): JSX.Element {
  return (
    <Button
      variant="contained"
      component={RouterLink}
      to={(location: { pathname: string; }) => `${location.pathname}/videos/${data.streamId}`}
    >
      분석하기
    </Button>
  );
}
const VideoListColumns = [
  {
    field: 'thumbnail', title: '썸네일', sorting: false, render: (data: VideoListItemType) => ThumbnailComponent(data),
  },
  {
    field: 'info',
    title: '동영상 정보',
    render: (data: VideoListItemType) => InfoComponent(data),
  },
  { field: 'likes', title: '좋아요수', render: (data: VideoListItemType) => LikesComponent(data) },
  { field: 'views', title: '조회수', render: (data: VideoListItemType) => ViewsComponent(data) },
  {
    field: 'link', title: '', sorting: false, render: (data: VideoListItemType) => ActionButtonComponent(data),
  },
];

interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

export default function VideoListTable(props: VideoListTableProps): JSX.Element {
  const { videoList, loading } = props;
  return (
    <MaterialTable
      columns={VideoListColumns}
      data={videoList}
      isLoading={loading}
      options={{
        toolbar: false,
        pageSize: 20,
        showFirstLastPageButtons: false,
        search: false,
        showTitle: false,
        draggable: false,
        sorting: false,
        paging: false,
      }}
    />
  );
}
