import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import { VideoListItemType } from '../VideoListTable';

// 제목, 별점, 업로드일자 컴포넌트---------------------------------
const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: 'red',
  },
}))(Rating);
const useInfoComponentStyle = makeStyles((theme: Theme) => createStyles({
  container: {
    color: '#4d4f5c',
  },
  title: {
    marginRight: theme.spacing(3),
  },
}));
function InfoInner(prop: VideoListItemType) {
  const classes = useInfoComponentStyle();
  const { data } = prop;
  return (
    <Grid container direction="column" className={classes.container}>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.title}>{data.title}</Typography>
        <StyledRating size="small" name="video-rating" value={data.rating} readOnly />
      </Grid>
      <Typography>{new Date(data.endDate).toISOString().split('T')[0]}</Typography>
    </Grid>
  );
}
export default function InfoComponent(data: VideoListItemType): JSX.Element {
  return <InfoInner data={data} />;
}
