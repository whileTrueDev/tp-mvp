import {
  Grid,
  Tooltip, Typography,
} from '@material-ui/core';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import React, { useMemo } from 'react';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import useRecentStreamStyles from '../style/RecentStream.styles';

export interface RecentStreamListItemProps {
  stream: RecentStream;
  onClick: () => void;
}

type Direction = 'down' | 'up';

function Thumb({ direction, size }: {direction: Direction, size: number}): JSX.Element {
  const src = `/images/rankingPage/thumb_${direction}.png`;
  return (
    <img src={src} alt="추천" width={size} height={size} />
  );
}

export default function RecentStreamListItem({
  stream,
  onClick,
}: RecentStreamListItemProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  const { isMobile: isSm } = useMediaSize();

  const title = useMemo(() => (
    stream.title.length > 25
      ? `${stream.title.slice(0, 25)}...`
      : stream.title), [stream.title]);


  const date = useMemo(() => dayjsFormatter(stream.startDate, 'date-only'), [stream.startDate]);
  const viewer = useMemo(() => `평균 시청자 수 : ${stream.viewer} 명`, [stream.viewer]);
  const likeCount = useMemo(() => ` ${stream.likeCount ? stream.likeCount.toLocaleString() : 0}`, [stream.likeCount]);
  const hateCount = useMemo(() => ` ${stream.hateCount ? stream.hateCount.toLocaleString() : 0}`, [stream.hateCount]);
  return (
    <Tooltip
      title={stream.title.length > 25 ? <Typography variant="body2">{stream.title}</Typography> : ''}
    >
      <Grid container onClick={onClick} className={classes.row}>
        <Grid item xs={12}><Typography className={classes.titleText}>{title}</Typography></Grid>
        <Grid item xs={3}><Typography className={classes.subText}>{date}</Typography></Grid>
        <Grid item xs={6}><Typography className={classes.subText}>{viewer}</Typography></Grid>
        <Grid item xs={3} container justify="space-around">
          <Typography className={classes.subText}>
            <Thumb direction="up" size={isSm ? 16 : 24} />
            {likeCount}
          </Typography>
          <Typography className={classes.subText}>
            <Thumb direction="down" size={isSm ? 16 : 24} />
            {hateCount}
          </Typography>
        </Grid>
      </Grid>
    </Tooltip>
  );
}
