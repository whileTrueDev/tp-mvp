import React, { memo } from 'react';
import {
  Typography, Chip, Grid,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { VideoListItemType } from '../VideoListTable';

// 좋아요 컴포넌트---------------------------------------
// LikesInner : style 적용을 위한 Inner컴포넌트
const useLikesStyle = makeStyles((theme: Theme) => createStyles({
  chip: {
    background: theme.palette.divider,
    color: theme.palette.grey.A700,
    padding: theme.spacing(0.5, 2),
    borderRadius: '14px',

  },
  label: {
    marginRight: theme.spacing(1),
  },
  textContainer: {
    flexWrap: 'nowrap',
  },

}));

function Likes(prop: VideoListItemType): JSX.Element {
  const classes = useLikesStyle();
  const { data } = prop;
  return (
    <Chip
      className={classes.chip}
      avatar={<ThumbUpIcon />}
      label={(
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.textContainer}
        >
          <Typography className={classes.label}>좋아요</Typography>
          <Typography>{data.likes}</Typography>
        </Grid>
      )}
    />
  );
}
export default memo(Likes);
