import {
  Tooltip, Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import dayjs from 'dayjs';
import React from 'react';
import useRecentStreamStyles from '../style/RecentStream.styles';

export interface RecentStreamListItemProps {
  stream: RecentStream & { marginLeft: number; height?: number };
  onClick: () => void;
}

export default function RecentStreamListItem({
  stream,
  onClick,
}: RecentStreamListItemProps): React.ReactElement {
  const classes = useRecentStreamStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      key={stream.title}
      style={{
        marginLeft: isSm ? 0 : stream.marginLeft,
        height: stream.height,
        zIndex: 2,
        position: 'relative',
      }}
    >
      <Tooltip
        title={stream.title.length > 25 ? <Typography variant="body2">{stream.title}</Typography> : ''}
      >
        <Typography onClick={onClick} variant="h4" className={classes.title}>
          {stream.title.length > 25 ? `${stream.title.slice(0, 25)}...` : stream.title}
          <Typography variant="body1" component="span" className={classes.subtitle}>
            {dayjs(stream.startDate).format('YYYY-MM-DD')}
          </Typography>
          <Typography variant="body1" component="span" className={classes.subtitle}>
            {`평균 시청자 수 : ${stream.viewer} 명`}
          </Typography>
          <Typography variant="body1" component="span" className={classes.subtitle} align="center">
            <img src="/images/rankingPage/thumb_up.png" alt="추천" width={24} height={24} />
            {` ${stream.likeCount ? stream.likeCount.toLocaleString() : 0}`}
          </Typography>
          <Typography variant="body1" component="span" className={classes.subtitle}>
            <img src="/images/rankingPage/thumb_down.png" alt="추천" width={24} height={24} />
            {` ${stream.hateCount ? stream.hateCount.toLocaleString() : 0}`}
          </Typography>
        </Typography>
      </Tooltip>
    </div>
  );
}
