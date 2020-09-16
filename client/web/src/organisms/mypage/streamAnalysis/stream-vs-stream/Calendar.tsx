import React from 'react';
// material-ui core components
import { Typography, Grid } from '@material-ui/core';
// material-ui picker components
import {
  Calendar, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import useAxios from 'axios-hooks';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

interface StreamCalendarProps {
  dayStreamsList: DayStreamsInfo[];
  handleDayStreamList : (responseList: DayStreamsInfo[]) => void;
  handleChangeDayStreamList : (selectedDate: Date) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  dayWithDotContainer: {
    position: 'relative'
  },
  dayWithDot: {
    position: 'absolute',
    height: 0,
    width: 0,
    border: '2px solid',
    borderRadius: 4,
    borderColor: '#ffff',
    right: '50%',
    transform: 'translateX(1px)',
    top: '80%'
  }
}));

function StreamCalendar(props: StreamCalendarProps) {
  const { dayStreamsList, handleDayStreamList, handleChangeDayStreamList } = props;
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const classes = useStyles();

  const handleChange = (_clickedDate: MaterialUiPickersDate) => {
    if (_clickedDate) {
      // console.log('d : ', clickedDate.getDate());
      // console.log('m : ', clickedDate.getMonth() + 1);
      // console.log('y : ', clickedDate.getFullYear());
      console.log('Clicked Date : ', _clickedDate);
      setClickedDate(_clickedDate);
      handleChangeDayStreamList(_clickedDate);
    }
  };

  const [{
    data: getMonthStreams,
    loading: getMonthStreamsLoading,
    error: getMonthStreamsError
  },
  excuteGetMonthStreams] = useAxios({
    url: 'http://localhost:3000/stream-analysis/stream-list',
  }, { manual: true });

  React.useEffect(() => {
    excuteGetMonthStreams({
      params: {
        userId: 'userId1',
        date: clickedDate.toISOString(),
      }
    }).then((result) => console.log(result.data));
  }, []);

  const renderDayInPicker = (date: MaterialUiPickersDate, selectedDate: MaterialUiPickersDate, dayInCurrentMonth: boolean, dayComponent: JSX.Element) => {
    const hasStreamDays: Date[] = dayStreamsList.map((streamInfo) => streamInfo.startedAt);
    // console.log(hasStreamDays);
    if (date && hasStreamDays.includes(new Date(date))) {
      // console.log(date);
      return (
        <div className={classes.dayWithDotContainer}>
          {dayComponent}
          <div className={classes.dayWithDot} />
        </div>
      );
    }

    return dayComponent;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Calendar
                date={clickedDate}
                onChange={handleChange}
                disableFuture
                renderDay={renderDayInPicker}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}

export default StreamCalendar;
