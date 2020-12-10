import React from 'react';
// material-ui core components
import { Grid, ThemeProvider } from '@material-ui/core';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
import { useSnackbar } from 'notistack';
// shared dtos , interfaces
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
// import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';

// axios
import useAxios from 'axios-hooks';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// date library
import moment from 'moment';
// interface
import { StreamCalendarProps } from './StreamCompareSectioninterface';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// attoms snackbar
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme: Theme) => ({
  hasStreamDayDot: {
    position: 'absolute',
    height: 0,
    width: 0,
    border: '3px solid',
    borderRadius: 5,
    borderColor: '#3a86ff',
    right: '44%',
    transform: 'translateX(1px)',
    top: '80%',
  },
  hasStreamDayDotContainer: {
    position: 'relative',
  },
}));
const reRequest = 3;

function StreamCalendar(props: StreamCalendarProps): JSX.Element {
  const {
    clickedDate, handleDayStreamList, setClickedDate,
    compareStream, baseStream,
  } = props;
  const classes = useStyles();
  const auth = useAuthContext();
  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>([]);
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>(new Date());
  const { enqueueSnackbar } = useSnackbar();

  const [
    {
      data: getStreamsData,
    }, excuteGetStreams] = useAxios<StreamDataType[]>({
      url: '/broadcast-info',
    }, { manual: true });

  const DATE_THEME = (others: Theme) => ({
    ...others,
    overrides: {
      MuiPickersDay: {
        daySelected: {
          backgroundColor: '#3a86ff',
        },
      },
      MuiPickersCalendar: {
        transitionContainer: {
          overflowY: 'hidden',
          overflowX: 'hidden',
          margin: others.spacing(1),
        },
      },
    },
  });

  /**
   * 달을 기준으로 3개월 이전 date, 3개월 이후 datestring 배열로 리턴
   * @param originDate 현재 달력이 위치한 달
   */
  const handleSubtractCurrMonth = (originDate: MaterialUiPickersDate): string[] => {
    if (originDate) {
      const rangeStart = moment(originDate).subtract(reRequest, 'month').format('YYYY-MM-DDThh:mm:ss');
      const rangeEnd = moment(originDate).add(reRequest, 'month').format('YYYY-MM-DDThh:mm:ss');
      return [rangeStart, rangeEnd];
    }

    return [];
  };

  React.useEffect(() => {
    const params: SearchCalendarStreams = {
      userId: auth.user.userId,
      startDate: handleSubtractCurrMonth(currMonth)[0],
      endDate: handleSubtractCurrMonth(currMonth)[1],
    };

    excuteGetStreams({
      params,
    }).then((result) => {
      setHasStreamDays(
        result.data.map((streamInfo) => moment(new Date(streamInfo.startDate)).format('YYYY-MM-DD')),
      );
    }).catch((err) => {
      if (err.message) {
        ShowSnack('달력 정보구성에 문제가 발생했습니다.', 'error', enqueueSnackbar);
      }
    });
  }, [auth.user.userId, currMonth, excuteGetStreams, enqueueSnackbar]);

  const handleDayChange = (newDate: MaterialUiPickersDate) => {
    if (newDate) setClickedDate(newDate);
    const dayStreamList: StreamDataType[] = [];
    try {
      if (getStreamsData) {
        getStreamsData.forEach((stream: StreamDataType) => {
          if (newDate
            && moment(newDate).format('YYYY-MM-DD') === moment(stream.startDate).format('YYYY-MM-DD')) {
            dayStreamList.push(stream);
          }
        });
      }
    } catch {
      handleDayStreamList([]);
    }
    handleDayStreamList(dayStreamList);
  };

  const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
    if (newMonth && Math.abs(moment(newMonth).diff(moment(currMonth), 'month')) >= reRequest) {
      setCurrMonth(newMonth);
    }
  };

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    if (date && hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && dayInCurrentMonth) {
      if ((compareStream && moment(new Date(compareStream.startDate)).format('YYYY-MM-DD')
      === moment(date).format('YYYY-MM-DD'))
      || (baseStream && moment(new Date(baseStream.startDate)).format('YYYY-MM-DD')
      === moment(date).format('YYYY-MM-DD'))) {
        return (
          <div className={classnames({
            [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
          })}
          >
            {React.cloneElement(dayComponent, { style: { backgroundColor: '#d7e7ff', color: 'white' } })}
            <div className={classnames({
              [classes.hasStreamDayDot]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
            })}
            />
          </div>
        );
      }

      return (
        <div className={classnames({
          [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
        })}
        >
          {dayComponent}
          <div className={classnames({
            [classes.hasStreamDayDot]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
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
            <Grid item>
              <ThemeProvider<typeof DATE_THEME> theme={DATE_THEME}>
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
              </ThemeProvider>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}

export default StreamCalendar;
