import React from 'react';
import { format } from 'date-fns';

// UserBroadCast 내에서 방송날짜 및 시간 컬럼에 사용되는 컴포넌트
function DateTimeDisplay(props: Record<string, any>): JSX.Element {
  const { startDate, endDate } = props;
  const [_startDate, _startTime] = format(new Date(startDate), 'yyyy-MM-dd,HH:mm:ss').split(',');
  const [_endDate, _endTime] = format(new Date(endDate), 'yyyy-MM-dd,HH:mm:ss').split(',');
  return (
    <div>
      {_startDate === _endDate
        ? <p>{`${_startDate} ${_startTime} ~ ${_endTime}`}</p>
        : <p>{`${_startDate} ${_startTime} ~ ${_endDate} ${_endTime}`}</p>}
    </div>
  );
}

export default DateTimeDisplay;
