import React from 'react';
import { ThemeProvider } from '@material-ui/core';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// import { MuiThemeProvider } from '@material-ui/core';
// date libary
import koLocale from 'date-fns/locale/ko';
import DateFnsUtils from '@date-io/date-fns';
// styles
import { Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import moment from 'moment';
// interfaces
import { CalendarProps } from './StreamAnalysisShared.interface';
import useAllCalendarStyles from './RangeSelectCalendar.style';

function Calendar(props: CalendarProps): JSX.Element {
  const {
    period, base, handleSelectedDate, currDate, selectedStreams,
  } = props;

  const classes = useAllCalendarStyles();
  const [point1, setPoint1] = React.useState<MaterialUiPickersDate>(period[0]);
  const [point2, setPoint2] = React.useState<MaterialUiPickersDate>(period[1]);

  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>(
    selectedStreams.map((stream) => moment(stream.startedAt).format('YYYY-MM-DD')),
  );

  const DATE_THEME = (others: Theme) => ({
    ...others,
    overrides: {
      MuiPickersDay: {
        daySelected: {
          backgroundColor: base ? '#3a86ff' : '#b1ae71',
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

  const leftHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.leftCircleBase]: base,
      [classes.leftCircleCompare]: !base,

    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#d7e7ff' : '#d3d19d' } })}
    </div>
  );

  const rightHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.rigthCircleBase]: base,
      [classes.rigthCircleCompare]: !base,

    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#d7e7ff' : '#d3d19d' } })}
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

    if (date && dayInCurrentMonth) {
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
      <ThemeProvider<typeof DATE_THEME> theme={DATE_THEME}>
        <DatePicker
          value={currDate}
          onChange={handleDate}
          disableFuture
          renderDay={renderDayInPicker}
          variant="static"
          openTo="date"
          disableToolbar
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>

  );
}

export default Calendar;
