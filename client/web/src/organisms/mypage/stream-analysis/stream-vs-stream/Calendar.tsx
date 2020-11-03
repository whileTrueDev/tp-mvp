import React from 'react';
// material-ui core components
import { Grid } from '@material-ui/core';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
// shared dtos , interfaces
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
// axios
import useAxios from 'axios-hooks';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// date library
// import moment from 'moment';
// attoms
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
// interface
import { StreamCalendarProps } from './StreamCompareSectioninterface';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

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
    top: '80%',
  },
  hasStreamDayDotContainer: {
    position: 'relative',
  },
}));

function StreamCalendar(props: StreamCalendarProps): JSX.Element {
  const {
    clickedDate, handleDayStreamList, setClickedDate,
    compareStream, baseStream, handleError,
  } = props;
  const classes = useStyles();
  const auth = useAuthContext();
  const [hasStreamDays, setHasStreamDays] = React.useState<number[]>([]);
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>();

  const [
    {
      data: getStreamsData,
      loading: getStreamsLoading,
      error: getStreamsError,
    }, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
      url: '/stream-analysis/stream-list',
    }, { manual: true });

  React.useEffect(() => {
    const params: SearchCalendarStreams = {
      userId: auth.user.userId,
      startDate: currMonth ? currMonth.toISOString() : (new Date()).toISOString(),
    };

    excuteGetStreams({
      params,
    }).then((result) => {
      setHasStreamDays(
        result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate()),
      );
    }).catch((err) => {
      if (err.message) {
        handleError({
          isError: true,
          helperText: '달력 정보 구성에 문제가 발생했습니다.',
        });
      }
    });
  }, [auth.user.userId, currMonth, excuteGetStreams, handleError]);

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
      const params: SearchCalendarStreams = {
        userId: auth.user.userId,
        startDate: newMonth.toISOString(),
      };

      excuteGetStreams({
        params,
      }).then((result) => {
        setHasStreamDays(
          result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate()),
        );
      }).catch((err) => {
        if (err.message) {
          handleError({
            isError: true,
            helperText: '달력 정보 구성에 문제가 발생했습니다.',
          });
        }
      });
    }
  };

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    if (date && hasStreamDays.includes(date.getDate()) && dayInCurrentMonth) {
      if ((compareStream && (new Date(compareStream.startedAt)).getDate() === date.getDate())
      || (baseStream && (new Date(baseStream.startedAt)).getDate() === date.getDate())) {
        return (
          <div className={classnames({
            [classes.hasStreamDayDotContainer]: hasStreamDays.includes(date.getDate()),
          })}
          >
            {React.cloneElement(dayComponent, { style: { color: '#3a86ff' } })}
            <div className={classnames({
              [classes.hasStreamDayDot]: hasStreamDays.includes(date.getDate()),
            })}
            />
          </div>
        );
      }

      return (
        <div className={classnames({
          [classes.hasStreamDayDotContainer]: hasStreamDays.includes(date.getDate()),
        })}
        >
          {dayComponent}
          <div className={classnames({
            [classes.hasStreamDayDot]: hasStreamDays.includes(date.getDate()),
          })}
          />
        </div>
      );
    }

    return dayComponent;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
          <Grid
            container
            direction="row"
            justify="center"
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
                inputProps={{
                  style: {
                    color: 'red',
                  },
                }}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}

export default StreamCalendar;
