import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';

function isInvalidDate(dateExpression: any) {
  const date = new Date(dateExpression);
  return Number.isNaN(date.getTime());
}

// UserBroadCast 내에서 방송날짜 및 시간 컬럼에 사용되는 컴포넌트
function DateTimeDisplay(props: Record<string, any>): JSX.Element {
  const { startDate, endDate } = props;

  // 유효하지 않은 날짜인 경우
  if (isInvalidDate(startDate) || isInvalidDate(endDate)) {
    return (
      <Typography>{`${startDate} ~ ${endDate}`}</Typography>
    );
  }
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
