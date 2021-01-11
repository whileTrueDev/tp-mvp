import React, { memo } from 'react';
import { Box } from '@material-ui/core';
import MaterialTable from '../../atoms/Table/MaterialTable';
import ActionButton from './VideoListTableRowComponents/ActionButton';
import Thumbnail from './VideoListTableRowComponents/Thumbnail';
import Info from './VideoListTableRowComponents/Info';
import Likes from './VideoListTableRowComponents/Likes';
import Views from './VideoListTableRowComponents/Views';

export interface VideoListItemType {
  [key: string]: any
}

const VideoListColumns: {[key: string]: any}[] = [
  {
    field: 'thumbnail',
    textAlign: 'center',
    title: '썸네일',
    sorting: false,
    render: Thumbnail,
  },
  {
    field: 'info',
    title: '동영상 정보',
    // sorting: false,
    customSort: (a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    render: Info,
  },
  {
    field: 'likes',
    textAlign: 'center',
    title: '좋아요수',
    // sorting: false,
    render: Likes,
  },
  {
    field: 'views',
    textAlign: 'center',
    title: '조회수',
    // sorting: false,
    render: Views,
  },
  {
    field: 'link',
    textAlign: 'center',
    title: '',
    sorting: false,
    render: ActionButton,
  },
];

export interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

// withStyles
export default memo((props: VideoListTableProps): JSX.Element => {
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
          // pageSize: 50,
          showFirstLastPageButtons: false,
          search: false,
          showTitle: false,
          draggable: false,
          // sorting: false,
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
});
