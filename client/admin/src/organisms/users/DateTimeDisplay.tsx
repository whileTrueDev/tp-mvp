import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';

// UserBroadCast 내에서 방송날짜 및 시간 컬럼에 사용되는 컴포넌트
function DateTimeDisplay(props: Record<string, any>): JSX.Element {
  const { startDate, endDate } = props;
  const [_startDate, _startTime] = format(new Date(startDate), 'yyyy/MM/dd,HH:mm:ss').split(',');
  const [_endDate, _endTime] = format(new Date(endDate), 'yyyy/MM/dd,HH:mm:ss').split(',');
  return (
    <Grid container justify="space-around" alignItems="center">
      <div>
        <Typography color="textSecondary">{_startDate}</Typography>
        <Typography>{_startTime}</Typography>
      </div>
      <Typography>~</Typography>
      <div>
        <Typography color="textSecondary">{_endDate}</Typography>
        <Typography>{_endTime}</Typography>
      </div>
    </Grid>
  );
}

export default memo(DateTimeDisplay);
