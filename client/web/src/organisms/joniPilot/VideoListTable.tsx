import React from 'react';
import { Box } from '@material-ui/core';
import MaterialTable from '../../atoms/Table/MaterialTable';
import {
  ThumbnailComponent, ActionButtonComponent, InfoComponent, LikesComponent, ViewsComponent,
} from './VideoListTableRowComponent';

export interface VideoListItemType {
  [key: string]: any
}

const VideoListColumns: {[key: string]: any}[] = [
  {
    field: 'thumbnail',
    textAlign: 'center',
    title: '썸네일',
    sorting: false,
    render: ThumbnailComponent,
  },
  {
    field: 'info',
    title: '동영상 정보',
    render: InfoComponent,
  },
  {
    field: 'likes',
    textAlign: 'center',
    title: '좋아요수',
    render: LikesComponent,
  },
  {
    field: 'views',
    textAlign: 'center',
    title: '조회수',
    render: ViewsComponent,
  },
  {
    field: 'link',
    textAlign: 'center',
    title: '',
    sorting: false,
    render: ActionButtonComponent,
  },
];

export interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

// withStyles
export default function VideoListTable(props: VideoListTableProps): JSX.Element {
  const { videoList, loading } = props;
  return (
    <Box mb={5}>
      <MaterialTable
        style={{ border: 'none' }}
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
          headerStyle: {
            backgroundColor: '#f5f6fa',
            color: '#a3a6b4',
            textAlign: 'center',
          },
        }}
      />
    </Box>
  );
}
