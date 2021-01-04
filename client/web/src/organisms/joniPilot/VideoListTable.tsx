import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import MaterialTable from '../../atoms/Table/MaterialTable';

export interface VideoListItemType {
  [key: string]: any
}

function ThumbnailComponent(data: VideoListItemType): JSX.Element {
  return <img src={data.thumbnail} alt={data.title} />;
}
function InfoComponent(data: VideoListItemType): JSX.Element {
  return (
    <div>
      <div>
        <span>{data.title}</span>
        <Rating name="video-rating" value={data.rating} readOnly />
      </div>
      <div>{data.date}</div>
    </div>
  );
}
function LikesComponent(data: VideoListItemType): JSX.Element {
  return <p>{data.likes}</p>;
}
function ViewsComponent(data: VideoListItemType): JSX.Element {
  return <p>{data.views}</p>;
}

function ActionButtonComponent(data: VideoListItemType): JSX.Element {
  return (
    <Button
      variant="contained"
      component={RouterLink}
      to={(location: { pathname: string; }) => `${location.pathname}/videos/${data.id}`}
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
    customSort: (a: VideoListItemType, b: VideoListItemType) => b.date - a.date,
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
      }}
    />
  );
}
