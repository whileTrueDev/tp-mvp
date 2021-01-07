import React from 'react';
import {
  Grid, Typography, Box,
} from '@material-ui/core';
import SelectDateIcon from '../../atoms/stream-analysis-icons/SelectDateIcon';
import useStreamHeroStyles from '../mypage/stream-analysis/stream-vs-stream/StreamCompareSection.style';

import RangeSelectCalendar from '../mypage/stream-analysis/shared/RangeSelectCalendar';

export default function VideoListPeriodSelector(props: {
  period: Date[],
  setPeriod: React.Dispatch<React.SetStateAction<Date[]>>
}): JSX.Element {
  const { period, setPeriod } = props;
  const handleOpen = () => {
    // console.log('handleopen');
  };
  const handleClose = () => {
    // console.log('handleclose');
  };

  const classes = useStreamHeroStyles();

  const handlePeriod = (startAt: Date, endAt: Date) => {
    const _period = {
      startAt, endAt,
    };
    /* 하루 선택시 이틀로 자동 변경 */
    if (_period.endAt.getDate() === _period.startAt.getDate()) {
      _period.endAt.setDate(_period.endAt.getDate() + 1);
    }
    setPeriod([_period.startAt, _period.endAt]);
  };

  return (
    <Box mb={4}>

      <Box mb={4}>
        <Typography variant="h6">동영상 분석을 위한 기간 설정</Typography>
      </Box>
      <Grid style={{ display: 'inline-block' }} className={classes.bodyWrapper}>
        <Typography className={classes.bodyTitle}>
          <SelectDateIcon className={classes.selectIcon} />
          날짜 선택
        </Typography>

        {/* Custom Date Picker 달력 컴포넌트 */}
        <div className={classes.calendarAndListWrapper}>
          <RangeSelectCalendar
            handlePeriod={handlePeriod}
            period={period}
            handleDialogClose={handleClose}
            handleDialogOpen={handleOpen}
            base
          />
        </div>

      </Grid>

    </Box>
  );
}
