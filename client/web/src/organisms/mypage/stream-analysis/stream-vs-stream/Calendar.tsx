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
import useTheme from '@material-ui/core/styles/useTheme';
import { StreamCalendarProps } from './StreamCompareSectioninterface';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
// attoms snackbar
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import usePublicMainUser from '../../../../utils/hooks/usePublicMainUser';

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
/**
 * 캘린더 달력 정보 재요청 할 개월수 전 후 단위  
 * 3 -> 위치한 달 전 3개월, 후 3개월 총 6개월
 */
const reRequest = 3;

function StreamCalendar(props: StreamCalendarProps): JSX.Element {
  const {
    clickedDate, handleDayStreamList, setClickedDate, exampleMode,
    compareStream, baseStream,
  } = props;
  const classes = useStyles();
  const auth = useAuthContext();
  const { user } = usePublicMainUser((state) => state);
  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>([]);
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  /**
   * 달력 구성을 위한 기간 내 방송 정보 요청
   */
  const [
    {
      data: getStreamsData,
    }, excuteGetStreams] = useAxios<StreamDataType[]>({
      url: '/broadcast-info',
    }, { manual: true });

  /**
   * material ui picker 의 테마 오버라이딩 (달력 테마를 조정하기 위해 필요)
   * @param others 트루포인트 테마 컨택스트
   */
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

  /**
   * 달력 선택 기간 (6개월) 변경에 따라 재요청
   */
  React.useEffect(() => {
    const params: SearchCalendarStreams = {
      userId: exampleMode ? 'sal_gu' : (user.userId || auth.user.userId),
      startDate: handleSubtractCurrMonth(currMonth)[0],
      endDate: handleSubtractCurrMonth(currMonth)[1],
    };

    excuteGetStreams({
      params,
    }).then((result) => {
      setHasStreamDays(
        result.data.map((streamInfo) => moment(streamInfo.startDate).format('YYYY-MM-DD')),
      );
    }).catch((err) => {
      if (err.message) {
        ShowSnack('달력 정보구성에 문제가 발생했습니다.', 'error', enqueueSnackbar);
      }
    });
  }, [exampleMode, auth.user.userId, currMonth, excuteGetStreams, enqueueSnackbar, user.userId]);

  /**
   * 달력 날짜 선택 핸들러
   * @param newDate 새로 선택된 날짜
   */
  const handleDayChange = (newDate: MaterialUiPickersDate) => {
    if (newDate) setClickedDate(newDate);
    const dayStreamList: StreamDataType[] = [];
    try {
      if (getStreamsData) {
        getStreamsData.forEach((stream: StreamDataType) => {
          if (newDate
            && moment(newDate).format('YYYY-MM-DD') === moment(stream.startDate).format('YYYY-MM-DD')) {
            if (!exampleMode) {
              dayStreamList.push(stream);
            } else {
              dayStreamList.push({ ...stream, title: '예시 방송입니다.' });
            }
          }
        });
      }
    } catch {
      handleDayStreamList([]);
    }
    handleDayStreamList(dayStreamList);
  };

  /**
   * 달의 차이가 전후 3개월 일 경우 새로운 월 상태값 갱신
   * @param newMonth 새로운 달
   */
  const handleMonthChange = (newMonth: MaterialUiPickersDate) => {
    if (newMonth && Math.abs(moment(newMonth).diff(moment(currMonth), 'month')) >= reRequest) {
      setCurrMonth(newMonth);
    }
  };

  /**
   * 달력 렌더링 함수
   * @param date 1 - 31 날짜 객체
   * @param selectedDate 선택된 날짜 객체
   * @param dayInCurrentMonth 현재 위치한 달에 해당 일이 존재 하는지 여부
   * @param dayComponent 달력상에서 표시할 일 컴포넌트
   */
  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    /**
     * 달력에 날짜가 현재 달에 존재하고,
     * 방송이 존재 하는 날이 거나 ,
     * 선택된 비교방송/기준방송 인 날 인 경우에
     */
    if (date && hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && dayInCurrentMonth) {
      if ((compareStream && moment(compareStream.startDate).format('YYYY-MM-DD')
      === moment(date).format('YYYY-MM-DD'))
      || (baseStream && moment(baseStream.startDate).format('YYYY-MM-DD')
      === moment(date).format('YYYY-MM-DD'))) {
        /* 방송이 존재함을 표시하는 날짜 컴포넌트를 렌더링한다. */
        return (
          <div className={classnames({
            [classes.hasStreamDayDotContainer]: hasStreamDays.includes(moment(date).format('YYYY-MM-DD')),
          })}
          >
            {React.cloneElement(dayComponent, { style: { backgroundColor: '#d7e7ff', color: theme.palette.common.white } })}
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
