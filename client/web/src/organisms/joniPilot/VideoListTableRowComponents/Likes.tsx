import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { VideoListItemType } from '../VideoListTable';

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
    padding: `${theme.spacing(0.5)}px ${theme.spacing(4)}px`,
    borderRadius: '14px',
    '& >*': {
      marginRight: `${theme.spacing(1)}px`,
    },
  },
}));
function LikesInner(prop: VideoListItemType) {
  const classes = useLikesInnerStyle();
  const { data } = prop;
  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        <ThumbUpIcon />
        <Typography>좋아요</Typography>
        <Typography>{data.likes}</Typography>
      </div>
    </div>
  );
}
export default function LikesComponent(data: VideoListItemType): JSX.Element {
  return <LikesInner data={data} />;
}
