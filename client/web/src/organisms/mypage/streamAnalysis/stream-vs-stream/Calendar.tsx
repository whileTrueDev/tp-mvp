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
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
// interface
import { StreamCalendarProps, DayStreamsInfo } from './StreamAnalysisHero.interface';

const useStyles = makeStyles((theme: Theme) => ({
  hasStreamDay: {
    backgroundColor: theme.palette.primary.light,
  },
  selectedDay: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark
  }
}));

function StreamCalendar(props: StreamCalendarProps): JSX.Element {
  const {
    clickedDate, handleDayStreamList, setClickedDate,
    compareStream, baseStream,
  } = props;
  const classes = useStyles();
  const [month, setMonth] = React.useState<Date>();
  const [hasStreamDays, setHasStreamDays] = React.useState<number[]>([]);

  const [
    {
      data: getStreamsData,
      loading: getStreamsLoading,
      error: getStreamsError
    }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: 'http://localhost:3000/stream-analysis/stream-list',
    }, { manual: true });

  React.useEffect(() => {
    excuteGetStreams({
      params: {
        userId: 'userId1',
        startDate: clickedDate.toISOString(),
      }
    }).then((result) => {
      setHasStreamDays(
        result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate())
      );
    });
  }, []);

  const handleDayChange = (newDate: MaterialUiPickersDate) => {
    if (newDate) setClickedDate(newDate);
    const dayStreamList: DayStreamsInfo[] = [];
    try {
      getStreamsData.forEach((stream: DayStreamsInfo) => {
        if (newDate && newDate.getDate() === (new Date(stream.startedAt)).getDate()) {
          dayStreamList.push(stream);
        }
      });
    } catch {
      handleDayStreamList([]);
    }
    handleDayStreamList(dayStreamList);
  };

  const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
    if (newMonth) {
      setMonth(newMonth);
      setClickedDate(newMonth);
      excuteGetStreams({
        params: {
          userId: 'userId1',
          startDate: newMonth.toISOString(),
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
      if ((compareStream && (new Date(compareStream.startedAt)).getDate() === date.getDate())
      || (baseStream && (new Date(baseStream.startedAt)).getDate() === date.getDate())) {
        return (
          React.cloneElement(dayComponent, { style: { backgroundColor: '#a8c4f9', color: '#3b86ff' } })
        );
      }

      return (
        React.cloneElement(dayComponent, { style: { backgroundColor: '#a8c4f9', } })
      );
    }

    if (getStreamsLoading || getStreamsError || (getStreamsData && getStreamsData.length === 0)) {
      return <CenterLoading />;
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
