import React from 'react';
import { Grid, Typography } from '@material-ui/core';
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
  { field: 'thumbnail', title: '썸네일', flex: 2 },
  { field: 'info', title: '동영상 정보', flex: 4 },
  { field: 'likes', title: '좋아요수', flex: 2 },
  { field: 'views', title: '조회수', flex: 2 },
  { field: 'link', title: '', flex: 2 },
];

export interface VideoListTableProps {
  videoList: VideoListItemType[],
  loading: boolean
}

interface VideoListRowPropType{
  rowData: VideoListItemType
}

const commonCellWidth = Object.fromEntries(VideoListColumns.map((c, i) => [`&>:nth-child(${i + 1})`, { flex: c.flex || 1 }]));
const useVideoListTableStyle = makeStyles((theme: Theme) => createStyles({
  header: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey.A200,
    '&>*': {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    ...commonCellWidth,
  },
  body: {
    position: 'relative',
  },
  row: {
    '&>*': {
      padding: theme.spacing(2),
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    ...commonCellWidth,
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
    <div>
      <Grid container className={classes.header}>
        {VideoListColumns.map((col) => (
          <Typography key={col.field}>{col.title}</Typography>
        ))}
      </Grid>
      <div className={classes.body}>
        {videoList.length
          ? videoList.map((item) => (
            <Grid className={classes.row} key={item.streamId} container direction="row">
              <Grid container><Thumbnail data={item} /></Grid>
              <Grid container><Info data={item} /></Grid>
              <Grid container><Likes data={item} /></Grid>
              <Grid container><Views data={item} /></Grid>
              <Grid container><ActionButton data={item} /></Grid>
            </Grid>
          ))
          : <Typography className={classes.noDataText}>데이터가 없습니다</Typography>}
        {loading && <CenterLoading />}
      </div>

    </div>
  );
}
