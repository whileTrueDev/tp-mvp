import React from 'react';
// material-ui core components
import { Grid } from '@material-ui/core';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import useAxios from 'axios-hooks';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { DayStreamsInfo, PerioudCompareCalendarProps } from './PerioudCompareHero.interface';

const useStyles = makeStyles((theme: Theme) => ({
  hasStreamDay: {
    backgroundColor: theme.palette.primary.light,
  },
  selectedDay: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark
  }
}));

function PerioudCompareCalendar(props: PerioudCompareCalendarProps): JSX.Element {
  const {
    // handleRangePush, handleResetRange, selectedRangeDate,
    handlePerioud
  } = props;
  const classes = useStyles();
  const [currDate, setCurrDate] = React.useState<MaterialUiPickersDate>();

  const [point1, setPoint1] = React.useState<MaterialUiPickersDate>(null);
  const [point2, setPoint2] = React.useState<MaterialUiPickersDate>(null);

  // 턴제를 사용한 2개의 교차 날짜 선택
  /*
    1. point1 == null point2 == null -> insert point1
    2. point1 != null point2 == null -> insert point2
    3. point1 != null point2 != null -> init point1, point2 , insert point1
  */
  const handleDate = (newDate: MaterialUiPickersDate) => {
    setCurrDate(newDate);

    if (newDate && point1 === null && point2 === null) {
      setPoint1(newDate);
    } else if (newDate && point1 !== null && point2 === null) {
      setPoint2(newDate);
      if (point1.getDate() <= newDate.getDate()) {
        handlePerioud(point1, newDate);
      } else {
        handlePerioud(newDate, point1);
      }
    } else if (point1 !== null && point2 !== null) {
      setPoint1(null); setPoint2(null);
      setPoint1(newDate);
    }
  };

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element
  ) => {
    if (date && point1 && point2 && date.getMonth() === point1.getMonth()) {
      if (Math.min(point1.getDate(), point2.getDate()) < date.getDate()
      && date.getDate() < Math.max(point1.getDate(), point2.getDate())) {
        return <div style={{ backgroundColor: 'red' }}>{dayComponent}</div>;
      }
      if (date.getDate() === point1.getDate() || date.getDate() === point2.getDate()) {
        return <div style={{ backgroundColor: 'blue' }}>{dayComponent}</div>;
      }
    }
    return dayComponent;
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <DatePicker
            value={currDate}
            onChange={handleDate}
            disableFuture
            renderDay={renderDayInPicker}
            variant="static"
            openTo="date"
            disableToolbar
          />
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>

  );
}

export default PerioudCompareCalendar;
