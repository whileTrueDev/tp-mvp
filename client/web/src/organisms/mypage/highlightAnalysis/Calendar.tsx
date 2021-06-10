import React from 'react';
import {
  Typography, makeStyles, ThemeProvider, Grid,
} from '@material-ui/core';

import {
  DatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
import { Theme } from '@material-ui/core/styles';
// shared dto and interfaces 
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
// date library
import moment from 'moment';
// atoms
import useAxios from 'axios-hooks';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import SelectDateIcon from '../../../atoms/stream-analysis-icons/SelectDateIcon';
// hooks
import useAuthContext from '../../../utils/hooks/useAuthContext';
import usePublicMainUser from '../../../utils/hooks/usePublicMainUser';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: '12px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  day: {
    backgroundColor: theme.palette.primary.light,
  },
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
  platformIcon: {
    marginRight: theme.spacing(3),
  },
  bodyTitle: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'AppleSDGothicNeo',
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(5),
    display: 'flex',
    marginBottom: theme.spacing(4),
  },
  selectIcon: {
    fontSize: '28.5px', marginRight: theme.spacing(3),
  },
}));

export interface StreamCalenderProps {
  exampleMode?: boolean;
  clickedDate: Date;
  handleClickedDate: (newDate: Date) => void;
  handleDayStreamList: (responseList: (StreamDataType)[]) => void;
}
function StreamCalendar(props: StreamCalenderProps): JSX.Element {
  /* 일감 - 편집점 분석 달력 렌더링 방식 변경 */
  const {
    exampleMode, clickedDate, handleClickedDate, handleDayStreamList,
  } = props;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

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

  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>(new Date());
  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>([]);
  const auth = useAuthContext();
  const {user} = usePublicMainUser((state) => state);

  const reRequest = 3;
  const [
    {
      data: getStreamsData,
    }, excuteGetStreams] = useAxios<StreamDataType[]>({
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
      userId: exampleMode ? 'sal_gu' : (user.userId || auth.user.userId),
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
  }, [exampleMode, auth.user.userId, user.userId, currMonth, excuteGetStreams, enqueueSnackbar]);

  const handleDayChange = (newDate: MaterialUiPickersDate) => {
    if (newDate) handleClickedDate(newDate);
    const dayStreamList: StreamDataType[] = [];
    try {
      if (getStreamsData) {
        getStreamsData.forEach((stream: StreamDataType) => {
          if (newDate
            && moment(newDate).format('YYYY-MM-DD') === moment(stream.startDate).format('YYYY-MM-DD')) {
            // 마케팅을 위한 개발 목적 => 추후 변경
            if (!exampleMode) {
              dayStreamList.push(stream);
            } else {
              dayStreamList.push({ ...stream, title: '예시 방송입니다' });
            }
          }
        });
      }
    } catch {
      handleDayStreamList([]);
    }
    handleDayStreamList(dayStreamList);
  };

  const handleMonthChange2 = (newMonth: MaterialUiPickersDate) => {
    if (newMonth && Math.abs(moment(newMonth).diff(moment(currMonth), 'month')) >= reRequest) {
      setCurrMonth(newMonth);
    }
  };

  const renderDayInPicker2 = (
    date: MaterialUiPickersDate,
    selectedDate2: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    if (date && hasStreamDays.includes(moment(date).format('YYYY-MM-DD')) && dayInCurrentMonth) {
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
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
        <Typography className={classes.bodyTitle}>
          <SelectDateIcon className={classes.selectIcon} />
          날짜 선택
        </Typography>
        <Grid item style={{ overflowY: 'hidden' }}>
          <ThemeProvider<typeof DATE_THEME> theme={DATE_THEME}>
            <DatePicker
              value={clickedDate}
              onChange={handleDayChange}
              disableFuture
              onMonthChange={handleMonthChange2}
              variant="static"
              openTo="date"
              disableToolbar
              renderDay={renderDayInPicker2}
            />
          </ThemeProvider>
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default StreamCalendar;
