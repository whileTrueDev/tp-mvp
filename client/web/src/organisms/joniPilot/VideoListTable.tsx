import React from 'react';
import {
  Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
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
  { field: 'thumbnail', title: '썸네일', width: '10%' },
  { field: 'info', title: '동영상 정보', width: '40%' },
  { field: 'likes', title: '좋아요수', width: '20%' },
  { field: 'views', title: '조회수', width: '20%' },
  { field: 'link', title: '', width: '10%' },
];

export interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

const useVideoListTableStyle = makeStyles((theme: Theme) => createStyles({
  tableContainer: {
    position: 'relative',
  },
  header: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey.A200,
    '&>*': {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
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
    <TableContainer className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow className={classes.header}>
            {VideoListColumns.map((col) => (
              <TableCell key={col.field} style={{ width: col.width || 'auto' }}>
                <Typography>{col.title}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
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
                <TableCell colSpan={VideoListColumns.length}>
                  <Typography className={classes.noDataText}>데이터가 없습니다</Typography>
                </TableCell>
              </TableRow>
            )}

        </TableBody>

      </Table>
      {loading && (<CenterLoading />)}
    </TableContainer>
  );
}
