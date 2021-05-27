import {
  Grid,
  Tooltip, Typography,
} from '@material-ui/core';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import useRecentStreamStyles from '../style/RecentStream.styles';

export interface RecentStreamListItemProps {
  stream: RecentStream & { marginLeft: number; height?: number };
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

  const date = useMemo(() => dayjs(stream.startDate).format('YYYY-MM-DD'), [stream.startDate]);
  const viewer = useMemo(() => `평균 시청자 수 : ${stream.viewer} 명`, [stream.viewer]);
  const likeCount = useMemo(() => ` ${stream.likeCount ? stream.likeCount.toLocaleString() : 0}`, [stream.likeCount]);
  const hateCount = useMemo(() => ` ${stream.hateCount ? stream.hateCount.toLocaleString() : 0}`, [stream.hateCount]);
  return (
    <div
      key={stream.title}
      style={{
        marginLeft: isSm ? 0 : stream.marginLeft,
        height: 'auto',
        zIndex: 2,
        position: 'relative',
      }}
    >
      <Tooltip
        title={stream.title.length > 25 ? <Typography variant="body2">{stream.title}</Typography> : ''}
      >
        <>
          <Grid container onClick={onClick} className={classes.row}>
            <Grid item xs={12} sm="auto"><Typography className={classes.titleText}>{title}</Typography></Grid>
            <Grid item xs={4} sm="auto"><Typography className={classes.subText}>{date}</Typography></Grid>
            <Grid item xs={6} sm="auto"><Typography className={classes.subText}>{viewer}</Typography></Grid>
            <Grid item xs={1} sm="auto">
              <Typography className={classes.subText}>
                <Thumb direction="up" size={isSm ? 12 : 24} />
                {likeCount}
              </Typography>
            </Grid>
            <Grid item xs={1} sm="auto">
              <Typography className={classes.subText}>
                <Thumb direction="down" size={isSm ? 12 : 24} />
                {hateCount}
              </Typography>

            </Grid>
          </Grid>

          {/* <Typography onClick={onClick} className={classes.title} component="span">
            {title}
            <Typography variant="body1" component="span" className={classes.subtitle}>
              {date}
            </Typography>
            <Typography variant="body1" component="span" className={classes.subtitle}>
              {viewer}
            </Typography>
            <Typography variant="body1" component="span" className={classes.subtitle} align="center">
              <Thumb direction="up" size={24} />
              {likeCount}
            </Typography>
            <Typography variant="body1" component="span" className={classes.subtitle}>
              <Thumb direction="down" size={24} />
              {hateCount}
            </Typography>
          </Typography> */}
        </>
      </Tooltip>
    </div>
  );
}
