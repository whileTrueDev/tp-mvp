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
  // handleDatePick: (selectedDate: Date, startAt: string, finishAt: string, fileId: string) => void;
  clickedDate: Date;
  handleClickedDate: (newDate: Date) => void;
  handleDayStreamList: (responseList: (StreamDataType)[]) => void;
  // dayStreamsList: DayStreamsInfo[];
}
function StreamCalendar(props: StreamCalenderProps): JSX.Element {
  /* 일감 - 편집점 분석 달력 렌더링 방식 변경 */
  const { clickedDate, handleClickedDate, handleDayStreamList } = props;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // const getStreamData: StreamData[] = new Array<StreamData>();
  // const [streamDays, setStreamDays] = React.useState<number[]>([]);
  // const [streamData, setStreamData] = React.useState<StreamData[]>(getStreamData);
  // const [selectedDate, setSelectedDate] = React.useState<MaterialUiPickersDate>(new Date());
  // // const [isLoading, setIsLoading] = React.useState(true);
  // const [isDataLoading, setDataIsLoading] = React.useState(true);
  // const [, setSelectedDay] = React.useState(0);
  // const [isDate, setIsDate] = React.useState(false);
  // const [, getHighlightList] = useAxios(
  //   { url: '/highlight/list' }, { manual: true },
  // );
  // const [, getStreamList] = useAxios(
  //   { url: '/highlight/stream' }, { manual: true },
  // );

  // const fetchListData = useCallback(async (
  //   platform: 'youtube'|'afreeca'|'twitch',
  //   name: string, year: string, month: string): Promise<void> => {
  //   getHighlightList({
  //     params: {
  //       platform, name, year, month,
  //     },
  //   }).then((res) => {
  //     if (res.data) {
  //       setStreamDays(res.data);
  //       // setIsLoading(false);
  //     }
  //   }).catch(() => {
  //     ShowSnack('오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
  //   });
  // }, [getHighlightList, enqueueSnackbar]);

  // const fetchStreamData = async (
  //   platform: 'youtube'|'afreeca'|'twitch', name: string, year: string, month: string, day: string): Promise<void> => {
  //   // 달력-> 날짜 선택시 해당 일의 방송을 로드
  //   getStreamList({
  //     params: {
  //       platform, name, year, month, day,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.data.length !== 0) {
  //         setStreamData(res.data);
  //         console.log(res.data);
  //       } else {
  //         setStreamData([{
  //           getState: false, startAt: '', finishAt: '', fileId: '', platform: 'afreeca',
  //         }]);
  //       }
  //     }).catch(() => {
  //       ShowSnack('해당 날짜의 방송목록을 불러오지 못했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
  //     });
  // };

  // const makeMonth = (month: number) => {
  //   if (month < 10) {
  //     const edit = `0${month}`;
  //     return edit;
  //   }
  //   const returnMonth = String(month);
  //   return returnMonth;
  // };

  // const makeDay = (day: number) => {
  //   if (day < 10) {
  //     const edit = `0${day}`;
  //     return edit;
  //   }
  //   const returnDay = String(day);
  //   return returnDay;
  // };

  // const handleMonthChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
  //   if (date) {
  //     const year = String(date.getFullYear());
  //     const month = date.getMonth() + 1;
  //     const editMonth = makeMonth(month);
  //     fetchListData('afreeca', '234175534', year, editMonth);
  //     resolve();
  //   }
  // });

  // const handleDateChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
  //   if (date) {
  //     const year = String(date.getFullYear());
  //     const month = makeDay(date.getMonth() + 1);
  //     const day = makeDay(date.getDate());
  //     fetchStreamData('afreeca', '234175534', year, month, day);
  //     setSelectedDay(Number(day));
  //     setSelectedDate(date);
  //     setIsDate(true);
  //     setDataIsLoading(false);
  //   }
  //   resolve();
  // });

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

  // 더미데이터 추후 수정 필요 - 임시 주석
  // React.useEffect(() => {
  //   fetchListData('afreeca', '234175534', '2020', '12');
  // }, [fetchListData]);
  /**
   * 일감 - 편집점 분석 달력 렌더링 방식 변경
   */
  const [currMonth, setCurrMonth] = React.useState<MaterialUiPickersDate>(new Date());
  const [hasStreamDays, setHasStreamDays] = React.useState<string[]>([]);
  const auth = useAuthContext();

  const reRequest = 3;
  const [
    {
      data: getStreamsData,
      // loading: getStreamsLoading,
      // error: getStreamsError,
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
    if (newDate) handleClickedDate(newDate);
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

      {/* <Box className={classes.paper}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
          <Typography variant="h6" style={{ marginLeft: '64px', display: 'inline-flex', marginBottom: 8 }}>
            <SelectDateIcon style={{ marginRight: '8px' }} />
            날짜선택
          </Typography>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item style={{ overflowY: 'hidden' }}>
              <ThemeProvider<typeof DATE_THEME> theme={DATE_THEME}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  disableFuture
                  onMonthChange={handleMonthChange}
                  variant="static"
                  openTo="date"
                  disableToolbar
                  renderDay={renderDayInPicker}
                />
              </ThemeProvider>
            </Grid>
            {isDate && !isDataLoading ? (
              <Grid item>
                <Grid
                  container
                  direction="column"
                  spacing={3}
                >
                  <div>
                    {streamData.map((value) => (
                      (selectedDate && value.getState) ? (
                        <Grid item key={value.fileId}>
                          <Button
                            style={{
                              width: '40vw', marginLeft: 50, justifyContent: 'flex-start', backgroundColor: '#theme.palette.primary.light',
                            }}
                            id={value.fileId}
                            onClick={() => {
                              handleDatePick(selectedDate, value.startAt, value.finishAt, value.fileId);
                            }}
                          >
                            <div className={classes.platformIcon}>
                              {platformIcon(value)}
                            </div>
                            {dateExpression({
                              compoName: 'highlight-calendar',
                              createdAt: (value.startAt),
                              finishAt: (value.finishAt),
                            })}
                          </Button>
                        </Grid>
                      ) : null
                    ))}
                  </div>
                </Grid>
              </Grid>
            ) : (
              <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  날짜를 선택해주세요.
                </Typography>
              </div>
            )}
          </Grid>
        </MuiPickersUtilsProvider>
      </Box> */}

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
