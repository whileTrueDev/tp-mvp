import React from 'react';
// material-ui core components
import {
  Box, Grid, Chip, ThemeProvider,
} from '@material-ui/core';
// material-ui picker components
import {
  MuiPickersUtilsProvider, DatePicker,
} from '@material-ui/pickers';
import useTheme from '@material-ui/core/styles/useTheme';

import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// date libary
import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
// axios
import useAxios from 'axios-hooks';
// styles
import { Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// shared dtos , interfaces
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
// icon
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
// context
import { useSnackbar } from 'notistack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// interfaces
import { RangeSelectCaledarProps } from './StreamAnalysisShared.interface';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAllCalendarStyles from './RangeSelectCalendar.style';

const reRequest = 3;
function RangeSelectCaledar(props: RangeSelectCaledarProps): JSX.Element {
  const {
    period, handlePeriod, base,
    handleDialogOpen, removeFunc,
  } = props;
  const classes = useAllCalendarStyles();
  // const subscribe = React.useContext(SubscribeContext);
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  /* 달력 선택 관련 state */
  const [currDate, setCurrDate] = React.useState<MaterialUiPickersDate>();
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>(new Date());
  const [point1, setPoint1] = React.useState<MaterialUiPickersDate>(null);
  const [point2, setPoint2] = React.useState<MaterialUiPickersDate>(null);

  /* 방송이 존재하는 날짜 date string 배열 */
  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>([]);

  /**
   * date picker 오버라이딩 theme
   * @param others truepoint theme context
   */
  const DATE_THEME = (others: Theme) => ({
    ...others,
    overrides: {
      MuiPickersDay: {
        daySelected: {
          backgroundColor: base ? '#d7e7ff' : '#d3d19d',
          // backgroundColor: base ? '#3a86ff' : '#b1ae71',
          '&:hover,select': {
            backgroundColor: base ? '#d7e7ff' : '#d3d19d',
            // backgroundColor: base ? '#3a86ff' : '#b1ae71',
          },
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

  /* 기간 내 존재 모든 방송 리스트 요청 */
  const [, excuteGetStreams] = useAxios<StreamDataType[]>({
    url: '/broadcast-info',
  }, { manual: true });

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
      if (err.response) {
        ShowSnack('달력 정보 구성에 문제가 발생했습니다.', 'error', enqueueSnackbar);
      }
    });
  }, [auth.user, excuteGetStreams, enqueueSnackbar, currMonth]);

  React.useEffect(() => {
    if (period.length > 1 && period[0] && period[1]) {
      setPoint1(period[0]);
      setPoint2(period[1]);

      /* 기간이 변경 되었을 경우 해당 기간의 중간날짜로 달력 포커싱 */
      const avgDate = (period[0].getTime() + period[1].getTime()) / 2;
      setCurrDate(new Date(avgDate));
    }
  }, [period]);

  // 구독 관련 기능 , CBT 주석 처리
  // React.useEffect(() => {
  //   setPoint1(null);
  //   setPoint2(null);
  // }, [auth.user]);

  /**
   * 13일 15시 = start => 13일 00시 00분, 13일 15시 = end => 13일 23시 59분
   * @param prevDate 선택된 날짜 (달력의 날짜 YYYY-MM-DDT15:00:00)
   * @param start 기간의 시작인지 여부
   */
  const timeFormatter = (prevDate: MaterialUiPickersDate, start?: true | undefined): Date => {
    if (start && prevDate) {
      const formattedStartDate = new Date(prevDate);
      formattedStartDate.setHours(0, 0, 0, 0);

      return formattedStartDate;
    }

    if (prevDate) {
      const formattedEndDate = new Date(prevDate);
      formattedEndDate.setHours(23, 59, 59, 59);
      return formattedEndDate;
    }

    return new Date(0);
  };

  /*
    1. point1 == null point2 == null -> insert point1
    2. point1 != null point2 == null -> insert point2
    3. point1 != null point2 != null -> init point1, point2 , insert point1
  */
  const handleDate = (newDate: MaterialUiPickersDate) => {
    if (newDate) setCurrDate(newDate);

    if (newDate && point1 === null && point2 === null) {
      setPoint1(newDate);
    } else if (newDate && point1 !== null && point2 === null) {
      setPoint2(newDate);
      if (point1.getTime() <= newDate.getTime()) {
        if (point1.getTime() === newDate.getTime()) {
          handlePeriod(timeFormatter(point1, true), timeFormatter(moment(newDate).add(1, 'days').toDate()), base);
        } else {
          handlePeriod(timeFormatter(point1, true), timeFormatter(newDate), base);
        }
      } else {
        handlePeriod(timeFormatter(newDate, true), timeFormatter(point1), base);
      }

      // const avgDate = (point1.getTime() + newDate.getTime()) / 2;
      // setCurrDate(new Date(avgDate));
    } else if (point1 !== null && point2 !== null) {
      setPoint1(null); setPoint2(null);
      setPoint1(newDate);
    }
  };

  /**
   * 전후 3개월(임의)에 해당하는 방송 정보를 가져오도록 유도
   * @param newMonth 해당 달의 첫째 날의 Date 객체
   */
  const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
    if (newMonth && Math.abs(moment(newMonth).diff(moment(currMonth), 'month')) >= reRequest) {
      setCurrMonth(newMonth);
    }
  };

  const leftHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.leftCircleBase]: base,
      [classes.leftCircleCompare]: !base,
    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#3a86ff' : '#b1ae71', color: theme.palette.common.white } })}
    </div>
  );

  const rightHalfCircleDay = (dayComponent: JSX.Element) => (
    <div className={classnames({
      [classes.rigthCircleBase]: base,
      [classes.rigthCircleCompare]: !base,
    })}
    >
      {React.cloneElement(dayComponent,
        { style: { backgroundColor: base ? '#3a86ff' : '#b1ae71', color: theme.palette.common.white } })}
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

      <Box
        borderRadius={16}
        borderColor="#707070"
        border={removeFunc ? 1 : 'none'}
        className={classes.container}
      >
        <Grid container direction="column">
          <Grid item>
            <ThemeProvider<typeof DATE_THEME> theme={DATE_THEME}>
              <DatePicker
                value={currDate}
                onChange={handleDate}
                onMonthChange={handleMonthChange}
                disableFuture
                renderDay={renderDayInPicker}
                variant="static"
                openTo="date"
                disableToolbar
              />
            </ThemeProvider>
          </Grid>

          {removeFunc && (
            <Chip
              icon={<FormatListBulletedIcon style={{ color: theme.palette.common.white }} />}
              label="제외할 방송 선택"
              clickable
              style={{
                width: '175px',
                alignSelf: 'flex-end',
                color: theme.palette.common.white,
                backgroundColor: '#aaaaaa',
              }}
              onClick={() => {
                if (period[0] && period[1] && handleDialogOpen) {
                  handleDialogOpen();
                } else {
                  ShowSnack('기간을 선택해 주세요.', 'info', enqueueSnackbar);
                }
              }}
            />
          )}
        </Grid>

      </Box>
    </MuiPickersUtilsProvider>

  );
}

export default React.forwardRef(RangeSelectCaledar);
