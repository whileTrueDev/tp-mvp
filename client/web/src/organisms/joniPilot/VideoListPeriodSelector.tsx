import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import SelectDateIcon from '../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../atoms/stream-analysis-icons/SelectVideoIcon';
import useStreamHeroStyles from '../mypage/stream-analysis/stream-vs-stream/StreamCompareSection.style';

import PeriodStreamsList from '../mypage/stream-analysis/shared/PeriodStreamsList';
import RangeSelectCalendar from '../mypage/stream-analysis/shared/RangeSelectCalendar';

import { StreamsListItem } from '../mypage/stream-analysis/shared/StreamAnalysisShared.interface';

export default function VideoListPeriodSelector(props: {
  streams: StreamsListItem[],
  period: Date[],
  setPeriod: React.Dispatch<React.SetStateAction<Date[]>>
}): JSX.Element {
  const { streams, period, setPeriod } = props;
  const handleStreamList = (targetItem: StreamsListItem, isRemoved?: boolean|undefined) => {
    // console.log(targetItem);
  };
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
    <div>
      <div>
        <Typography>동영상 분석을 위한 기간 설정</Typography>
        <Typography>선택된 방송</Typography>
      </div>
      <Grid item container direction="row">
        <Grid container className={classes.bodyWrapper} style={{ minWidth: '1000px' }}>
          <Grid item style={{ width: '310px', marginRight: 32 }}>
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
              />
            </div>

          </Grid>
          <Grid item className={classes.streamSelectWrapper} xs>
            <Typography className={classes.bodyTitle}>
              <SelectVideoIcon className={classes.selectIcon} />
              방송 선택
            </Typography>
            {/* 달력 날짜 선택시 해당 날짜 방송 리스트 */}
            <div className={classes.calendarAndListWrapper}>
              {/* 모든 방송 리스트 */}
              <PeriodStreamsList
                selectedStreams={streams}
                handleStreamList={handleStreamList}
              />
            </div>
          </Grid>

        </Grid>
      </Grid>
    </div>
  );
}
