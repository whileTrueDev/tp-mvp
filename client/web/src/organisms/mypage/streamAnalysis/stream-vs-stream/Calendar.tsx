import React from 'react';
// material-ui core components
import { Typography, Grid } from '@material-ui/core';
// material-ui picker components
import {
  Calendar, MuiPickersUtilsProvider, DatePicker
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import useAxios from 'axios-hooks';
import { makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';

// 

export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

interface StreamCalendarProps {
  handleDayStreamList:(responseList: (DayStreamsInfo)[]) => void;
  clickedDate: Date;
  setClickedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  hasStreamDay: {
    backgroundColor: 'red',
  },
}));

function StreamCalendar(props: StreamCalendarProps) {
  const { clickedDate, handleDayStreamList, setClickedDate } = props;
  const classes = useStyles();
  const [month, setMonth] = React.useState<Date>();
  const [hasStreamDays, setHasStreamDays] = React.useState<number[]>([]);

  const [{ data: getStreamsData, }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
    url: 'http://localhost:3000/stream-analysis/stream-list',
  }, { manual: true });

  React.useEffect(() => {
    excuteGetStreams({
      params: {
        userId: 'userId1',
        date: clickedDate.toISOString(),
      }
    }).then((result) => setHasStreamDays(
      result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate())
    ));
  }, []);

  const handleDayChange = (newDate: MaterialUiPickersDate) => {
    // 일이 바뀌면 백그라운드만 바뀌면 됨
    if (newDate) setClickedDate(newDate);
    const dayStreamList: DayStreamsInfo[] = [];
    getStreamsData.forEach((stream) => {
      if (newDate && newDate.getDate() === (new Date(stream.startedAt)).getDate()) {
        dayStreamList.push(stream);
      }
    });
    handleDayStreamList(dayStreamList);
  };

  const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
    // 달이 바뀌면 새롭게 방송있었던 날을 리렌더링 해야함
    if (newMonth) {
      setMonth(newMonth);
      excuteGetStreams({
        params: {
          userId: 'userId1',
          date: newMonth.toISOString(),
        }
      }).then((result) => {
        setHasStreamDays(
          result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate())
        );
      });
    }
  };

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element
  ) => {
    if (date && hasStreamDays.includes(date.getDate())) {
      return (
        React.cloneElement(dayComponent,
          { style: { backgroundColor: '#a6c1f9', } })
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
              <DatePicker
                value={clickedDate}
                onChange={handleDayChange}
                onMonthChange={handleMonthChange}
                disableFuture
                renderDay={renderDayInPicker}
                variant="static"
                openTo="date"
                disableToolbar
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}

export default StreamCalendar;
