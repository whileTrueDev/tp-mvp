import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button, Typography, Grid,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { VideoListItemType } from './VideoListTable';

// 조회수 컴포넌트-------------------------------------
function formattingViewCount(viewCount: number) {
  if (viewCount < 10000) {
    return viewCount;
  }
  return `${(viewCount / 10000).toFixed(2)} 만`;
}

export function ViewsComponent(data: VideoListItemType): JSX.Element {
  return <Typography>{formattingViewCount(data.views)}</Typography>;
}

// 썸네일 컴포넌트-------------------------------------------
export function ThumbnailComponent(data: VideoListItemType): JSX.Element {
  return <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />;
}

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
export function InfoComponent(data: VideoListItemType): JSX.Element {
  return <InfoInner data={data} />;
}

// 좋아요 컴포넌트---------------------------------------
// LikesInner : style 적용을 위한 Inner컴포넌트
// ViewsComponent 내에서 useStyle 훅 사용하면 invalid 오류가 나서 한번 더 감쌈
const useLikesInnerStyle = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    fontSize: '1rem',
    color: '#6a6a6a',
  },
  inner: {
    display: 'flex',
    background: 'rgba(112, 112, 112,0.3)',
    padding: '0.2em 1em',
    borderRadius: '14px',
    '& >*': {
      marginRight: '0.5em',
    },
  },
}));
function LikesInner(prop: VideoListItemType) {
  const classes = useLikesInnerStyle();
  const { data } = prop; return (
    <div className={classes.container}>
      <div className={classes.inner}>
        <ThumbUpIcon />
        <Typography>좋아요</Typography>
        <Typography>{data.likes}</Typography>
      </div>

    </div>

  );
}
export function LikesComponent(data: VideoListItemType): JSX.Element {
  return <LikesInner data={data} />;
}

// 액션버튼(router link)--------------------------------
export function ActionButtonComponent(data: VideoListItemType): JSX.Element {
  return (
    <Button
      variant="contained"
      component={RouterLink}
      color="secondary"
      to={(location: { pathname: string; }) => `${location.pathname}/videos/${data.streamId}`}
    >
      분석하기
    </Button>
  );
}
