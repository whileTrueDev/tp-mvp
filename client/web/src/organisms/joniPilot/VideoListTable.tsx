import React from 'react';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ActionButton from './VideoListTableRowComponents/ActionButton';
import Thumbnail from './VideoListTableRowComponents/Thumbnail';
import Info from './VideoListTableRowComponents/Info';
import Likes from './VideoListTableRowComponents/Likes';
import Views from './VideoListTableRowComponents/Views';
import CenterLoading from '../../atoms/Loading/CenterLoading';

export interface VideoListItemType {
  [key: string]: any
}

const VideoListColumns: {[key: string]: any}[] = [
  { field: 'thumbnail', title: '썸네일' },
  { field: 'info', title: '동영상 정보' },
  { field: 'likes', title: '좋아요수' },
  { field: 'views', title: '조회수' },
  { field: 'link', title: '' },
];

export interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

interface VideoListRowPropType{
  rowData: VideoListItemType
}

const useVideoListTableStyle = makeStyles((theme: Theme) => createStyles({
  header: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey.A200,
    '&>*': {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  },
  body: {
    position: 'relative',
  },
  row: {
    '&>*': {
      padding: theme.spacing(2),
      textAlign: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  noDataText: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },

}));

export default function VideoListTable(props: VideoListTableProps): JSX.Element {
  const { videoList, loading } = props;
  const classes = useVideoListTableStyle();
  return (
    <Table>
      <TableHead>
        <TableRow className={classes.header}>
          {VideoListColumns.map((col) => (
            <TableCell>
              <Typography key={col.field}>{col.title}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {videoList.length
          ? videoList.map((item) => (
            <TableRow className={classes.row} key={item.streamId}>
              <TableCell><Thumbnail data={item} /></TableCell>
              <TableCell><Info data={item} /></TableCell>
              <TableCell><Likes data={item} /></TableCell>
              <TableCell><Views data={item} /></TableCell>
              <TableCell><ActionButton data={item} /></TableCell>
            </TableRow>
          ))
          : (
            <TableRow>
              <Typography className={classes.noDataText}>데이터가 없습니다</Typography>
            </TableRow>
          )}
        {loading && (<CenterLoading />)}
      </TableBody>

    </Table>
  );
}
