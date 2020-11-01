import React from 'react';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import koLocale from 'date-fns/locale/ko';
import DateFnsUtils from '@date-io/date-fns';
// axios
// import useAxios from 'axios-hooks';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// interfaces
import moment from 'moment';
import { CalendarProps } from './PeriodAnalysisSection.interface';
// context 
// import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

const useStyles = makeStyles((theme: Theme) => ({
  leftCircleBase: {
    width: '50%',
    backgroundColor: '#d7e7ff',
  },
  leftCircleCompare: {
    width: '50%',
    backgroundColor: '#909090',
  },
  rigthCircleBase: {
    background: `linear-gradient(to left,#d7e7ff 50%, ${theme.palette.background.paper} 50%)`,
  },
  rigthCircleCompare: {
    background: `linear-gradient(to left,#909090 50%, ${theme.palette.background.paper} 50%)`,
  },
  rangeDayBase: {
    backgroundColor: '#d7e7ff',
  },
  rangeDayCompare: {
    backgroundColor: '#909090',
  },
  selectedDayBase: {
    backgroundColor: '#d7e7ff',
  },
  selectedDayCompare: {
    backgroundColor: '#909090',
  },
  hasStreamDayDotContainer: {
    position: 'relative',
  },
  hasStreamDayDotBase: {
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
  hasStreamDayDotCompare: {
    position: 'absolute',
    height: 0,
    width: 0,
    border: '3px solid',
    borderRadius: 4,
    borderColor: '#6e6e6e',
    right: '50%',
    transform: 'translateX(1px)',
    top: '80%',
  },
}));

function Calendar(props: CalendarProps): JSX.Element {
  const {
    period, base, handleSelectedDate, currDate, selectedStreams,
  } = props;
  const classes = useStyles();
  // const subscribe = React.useContext(SubscribeContext);
  // const [currDate, setCurrDate] = React.useState<MaterialUiPickersDate>();
  const [point1, setPoint1] = React.useState<MaterialUiPickersDate>(period[0]);
  const [point2, setPoint2] = React.useState<MaterialUiPickersDate>(period[1]);

  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>(
    selectedStreams.map((stream) => moment(stream.startedAt).format('YYYY-MM-DD')),
  );

  React.useEffect(() => {
    setHasStreamDays(
      selectedStreams.map((stream) => moment(stream.startedAt).format('YYYY-MM-DD')),
    );
  }, [selectedStreams]);

  React.useEffect(() => {
    if (period[0] && period[1]) {
      setPoint1(period[0]);
      setPoint2(period[1]);
    }
  }, [period]);

  // const [, excuteGetStreams] = useAxios<DayStreamsInfo[]>({
  //   url: '/stream-analysis/stream-list',
  // }, { manual: true });

  /* CBT 주석 사항 - 구독한 유저 전환시 재요청 기능 */
  // React.useEffect(() => {
  //   excuteGetStreams({
  //     params: {
  //       userId: subscribe.currUser.targetUserId,
  //       startDate: currMonth ? currMonth.toISOString() : (new Date()).toISOString(),
  //     },
  //   }).then((result) => {
  //     setHasStreamDays(
  //       result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate()),
  //     );
  //   });
  // }, [subscribe.currUser, excuteGetStreams, currMonth]);

  const handleDate = (newDate: MaterialUiPickersDate) => {
    if (newDate) handleSelectedDate(newDate);
  };

  // const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
  //   if (newMonth) setCurrMonth(newMonth);
  //   // if (newMonth) {
  //   //   excuteGetStreams({
  //   //     params: {
  //   //       userId: subscribe.currUser.targetUserId,
  //   //       startDate: newMonth.toISOString(),
  //   //     },
  //   //   }).then((result) => {
  //   //     setHasStreamDays(
  //   //       result.data.map((streamInfo) => (new Date(streamInfo.startedAt)).getDate()),
  //   //     );
  //   //   });
  //   // }
  // };

  const leftHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.leftCircleBase]: base,
      [classes.leftCircleCompare]: !base,
    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#d7e7ff' : '#6e6e6e' } })}
    </div>
  );

  const rightHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.rigthCircleBase]: base,
      [classes.rigthCircleCompare]: !base,
    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#d7e7ff' : '#6e6e6e' } })}
    </div>
  );

  const rangeInnerDay = (dayComponent: JSX.Element, date: Date) => (
    <div className={classnames({
      [classes.rangeDayBase]: base,
      [classes.rangeDayCompare]: !base,
      [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
    })}
    >
      {dayComponent}
      <div className={classnames({
        [classes.hasStreamDayDotBase]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && base,
        [classes.hasStreamDayDotCompare]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && !base,
      })}
      />
    </div>
  );

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    if (dayInCurrentMonth && date && point1 && point2) {
      if (date.getMonth() === point1.getMonth() && point1.getMonth() === point2.getMonth()) {
        if (point1.getDate() === date.getDate()) {
          if (point1.getDate() > point2.getDate()) {
            return leftHalfCircleDay(dayComponent);
          }

          return rightHalfCircleDay(dayComponent);
        }
        if (point2.getDate() === date.getDate()) {
          if (point1.getDate() < point2.getDate()) {
            return leftHalfCircleDay(dayComponent);
          }

          return rightHalfCircleDay(dayComponent);
        }
        if (Math.min(point1.getDate(), point2.getDate()) < date.getDate()
        && date.getDate() < Math.max(point1.getDate(), point2.getDate())) {
          return rangeInnerDay(dayComponent, date);
        }
        return (
          <div className={classnames({
            [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
          })}
          >
            {dayComponent}
            <div className={classnames({
              [classes.hasStreamDayDotBase]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && base,
              [classes.hasStreamDayDotCompare]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && !base,
            })}
            />
          </div>
        );
      }
      if (point1.getMonth() !== point2.getMonth() && point1.getMonth() < point2.getMonth()) {
        if (date.getDate() === point1.getDate() && date.getMonth() === point1.getMonth()) {
          return rightHalfCircleDay(dayComponent);
        }
        if (date.getDate() === point2.getDate() && date.getMonth() === point2.getMonth()) {
          return leftHalfCircleDay(dayComponent);
        }

        if (Math.min(point1.getMonth(), point2.getMonth()) < date.getMonth()
          && date.getMonth() < Math.max(point1.getMonth(), point2.getMonth())) {
          return rangeInnerDay(dayComponent, date);
        }
        if ((point1.getDate() < date.getDate() && point1.getMonth() === date.getMonth())
        || (date.getDate() < point2.getDate() && point2.getMonth() === date.getMonth())) {
          return rangeInnerDay(dayComponent, date);
        }
      } else if (point1.getMonth() !== point2.getMonth() && point1.getMonth() > point2.getMonth()) {
        if (date.getDate() === point2.getDate() && date.getMonth() === point2.getMonth()) {
          return rightHalfCircleDay(dayComponent);
        }
        if (date.getDate() === point1.getDate() && date.getMonth() === point1.getMonth()) {
          return leftHalfCircleDay(dayComponent);
        }
        if (Math.min(point1.getMonth(), point2.getMonth()) < date.getMonth()
          && date.getMonth() < Math.max(point1.getMonth(), point2.getMonth())) {
          return rangeInnerDay(dayComponent, date);
        }
        if ((point1.getDate() > date.getDate() && point1.getMonth() === date.getMonth())
        || (date.getDate() > point2.getDate() && point2.getMonth() === date.getMonth())) {
          return rangeInnerDay(dayComponent, date);
        }
      }
    }

    if (date) {
      return (
        <div className={classnames({
          [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
        })}
        >
          {dayComponent}
          <div className={classnames({
            [classes.hasStreamDayDotBase]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && base,
            [classes.hasStreamDayDotCompare]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && !base,
          })}
          />
        </div>
      );
    }
    return dayComponent;
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>

      <DatePicker
        value={currDate}
        onChange={handleDate}
        // onMonthChange={handleMonthChange}
        disableFuture
        renderDay={renderDayInPicker}
        variant="static"
        openTo="date"
        disableToolbar
      />

    </MuiPickersUtilsProvider>
  );
}

export default Calendar;
