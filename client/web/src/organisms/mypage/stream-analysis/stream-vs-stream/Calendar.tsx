import React, { useEffect } from 'react';
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
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
// interface
import { StreamCalendarProps, DayStreamsInfo } from './StreamCompareSectioninterface';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

const useStyles = makeStyles((theme: Theme) => ({
  hasStreamDayDot: {
    position: 'absolute',
    height: 0,
    width: 0,
    border: '3px solid',
    borderRadius: 4,
    borderColor: '#3a86ff',
    right: '50%',
    transform: 'translateX(1px)',
    top: '80%'
  },
  hasStreamDayDotContainer: {
    position: 'relative'
  }
}));

function StreamCalendar(props: StreamCalendarProps): JSX.Element {
  const {
    clickedDate, handleDayStreamList, setClickedDate,
    compareStream, baseStream,
  } = props;
  const classes = useStyles();
  const subscribe = React.useContext(SubscribeContext);
  const [hasStreamDays, setHasStreamDays] = React.useState<number[]>([]);
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>();

  const [
    {
      data: getStreamsData,
      loading: getStreamsLoading,
      error: getStreamsError
    }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: 'http://localhost:3000/stream-analysis/stream-list',
    }, { manual: true });

  useEffect(() => {
    excuteGetStreams({
      params: {
        userId: subscribe.currUser.targetUserId,
        startDate: currMonth ? currMonth.toISOString() : (new Date()).toISOString(),
      }
    }).then((result) => {
      setHasStreamDays(
        result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate())
      );
    });
  }, [subscribe.currUser, currMonth, excuteGetStreams]);

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
      setCurrMonth(newMonth);
      excuteGetStreams({
        params: {
          userId: subscribe.currUser.targetUserId,
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
          <div className={classnames({
            [classes.hasStreamDayDotContainer]: hasStreamDays.includes(date.getDate())
          })}
          >
            {React.cloneElement(dayComponent, { style: { color: '#3a86ff' } })}
            <div className={classnames({
              [classes.hasStreamDayDot]: hasStreamDays.includes(date.getDate())
            })}
            />
          </div>
        );
      }

      return (
        <div className={classnames({
          [classes.hasStreamDayDotContainer]: hasStreamDays.includes(date.getDate())
        })}
        >
          {dayComponent}
          <div className={classnames({
            [classes.hasStreamDayDot]: hasStreamDays.includes(date.getDate())
          })}
          />
        </div>
      );
    }
    // getStreamsLoading || getStreamsError || (getStreamsData && getStreamsData.length === 0)
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
            {(getStreamsLoading || getStreamsError)
            && <CenterLoading />}
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
