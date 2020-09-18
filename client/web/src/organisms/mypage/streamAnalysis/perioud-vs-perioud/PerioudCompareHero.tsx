import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse,
  TextField
} from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import PerioudCompareCalendar from './PerioudCompareCalendar';
import PerioudCompareTextField from './PerioudCompareTextField';
import { DayStreamsInfo } from './PerioudCompareHero.interface';

export default function PerioudCompareHero(): JSX.Element {
  // const [selectedRangeDate, setSelectedRangeDate] = React.useState<DayStreamsInfo[]>([]);

  // const handleRangePush = (pushedDate: DayStreamsInfo) => {
  //   const originRange = selectedRangeDate;
  //   originRange.push(pushedDate);
  //   setSelectedRangeDate(originRange);
  // };

  // const handleResetRange = () => {
  //   setSelectedRangeDate([]);
  // };
  const [perioud, setPerioud] = React.useState<Date[]>(new Array<Date>(2));

  const handlePerioud = (startAt: Date, endAt: Date) => {
    const per = [startAt, endAt];
    setPerioud(per);
  };

  React.useEffect(() => {
    console.log(perioud);
  }, [perioud]);

  return (
    <div>
      <Typography>
        기간 대 기간 분석
      </Typography>
      <Typography align="right">
        데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
      </Typography>
      <Typography>
        기간별 분석을 위한 기간을 설정해 주세요.
      </Typography>
      <Divider />
      <Grid container direction="row" xs={12} justify="center">
        <Grid item style={{ marginRight: '30px' }}>
          <PerioudCompareTextField />
          <PerioudCompareCalendar
            handlePerioud={handlePerioud}
          />
        </Grid>
        <Typography style={{ marginRight: '30px', }}>
          VS
        </Typography>
        <Grid item style={{ marginRight: '30px', }}>
          <PerioudCompareTextField />
          <PerioudCompareCalendar
            handlePerioud={handlePerioud}
          />
        </Grid>
      </Grid>
    </div>
  );
}
