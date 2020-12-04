import React, { useCallback } from 'react';
import {
  Box, Typography, makeStyles, ThemeProvider,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import {
  DatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import Button from '../../../atoms/Button/Button';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import YoutubeIcon from '../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../atoms/stream-analysis-icons/AfreecaIcon';
import dateExpression from '../../../utils/dateExpression';
import SelectDateIcon from '../../../atoms/stream-analysis-icons/SelectDateIcon';

interface StreamData {
  getState: boolean;
  startAt: string;
  finishAt: string;
  fileId: string;
  platform: 'youtube'|'afreeca'|'twitch';
}

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
  videoTitle: {
    marginLeft: theme.spacing(3),
  },
}));

export interface StreamCalenderProps {
  handleDatePick: (selectedDate: Date, startAt: string, finishAt: string, fileId: string) => void;
}
function StreamCalendar({ handleDatePick }: StreamCalenderProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const getStreamData: StreamData[] = new Array<StreamData>();
  const [streamDays, setStreamDays] = React.useState<number[]>([]);
  const [streamData, setStreamData] = React.useState<StreamData[]>(getStreamData);
  const [selectedDate, setSelectedDate] = React.useState<MaterialUiPickersDate>(new Date());
  // const [isLoading, setIsLoading] = React.useState(true);
  const [isDataLoading, setDataIsLoading] = React.useState(true);
  const [, setSelectedDay] = React.useState(0);
  const [isDate, setIsDate] = React.useState(false);
  const [, getHighlightList] = useAxios(
    { url: '/highlight/list' }, { manual: true },
  );
  const [, getStreamList] = useAxios(
    { url: '/highlight/stream' }, { manual: true },
  );

  const fetchListData = useCallback(async (
    platform: 'youtube'|'afreeca'|'twitch',
    name: string, year: string, month: string): Promise<void> => {
    getHighlightList({
      params: {
        platform, name, year, month,
      },
    }).then((res) => {
      if (res.data) {
        setStreamDays(res.data);
        // setIsLoading(false);
      }
    }).catch(() => {
      ShowSnack('오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
    });
  }, [getHighlightList, enqueueSnackbar]);

  const fetchStreamData = async (
    platform: 'youtube'|'afreeca'|'twitch', name: string, year: string, month: string, day: string): Promise<void> => {
    // 달력-> 날짜 선택시 해당 일의 방송을 로드
    getStreamList({
      params: {
        platform, name, year, month, day,
      },
    })
      .then((res) => {
        if (res.data.length !== 0) {
          setStreamData(res.data);
        } else {
          setStreamData([{
            getState: false, startAt: '', finishAt: '', fileId: '', platform: 'afreeca',
          }]);
        }
      }).catch(() => {
        ShowSnack('해당 날짜의 방송목록을 불러오지 못했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  const makeMonth = (month: number) => {
    if (month < 10) {
      const edit = `0${month}`;
      return edit;
    }
    const returnMonth = String(month);
    return returnMonth;
  };

  const makeDay = (day: number) => {
    if (day < 10) {
      const edit = `0${day}`;
      return edit;
    }
    const returnDay = String(day);
    return returnDay;
  };

  const handleMonthChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
    if (date) {
      const year = String(date.getFullYear());
      const month = date.getMonth() + 1;
      const editMonth = makeMonth(month);
      fetchListData('afreeca', '234175534', year, editMonth);
      resolve();
    }
  });

  const handleDateChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
    if (date) {
      const year = String(date.getFullYear());
      const month = makeDay(date.getMonth() + 1);
      const day = makeDay(date.getDate());
      fetchStreamData('afreeca', '234175534', year, month, day);
      setSelectedDay(Number(day));
      setSelectedDate(date);
      setIsDate(true);
      setDataIsLoading(false);
    }
    resolve();
  });

  const DATE_THEME = (others: Theme) => ({
    ...others,
    overrides: {
      MuiPickersDay: {
        daySelected: {
          backgroundColor: '#d7e7ff',
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
  React.useEffect(() => {
    fetchListData('afreeca', '234175534', '2020', '12');
  }, [fetchListData]);

  const renderDayInPicker = (
    date: MaterialUiPickersDate,
    selectedCalendarDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => {
    if (date && dayInCurrentMonth && streamDays.includes(date.getDate())) {
      return (
        <div className={classnames({
          [classes.hasStreamDayDotContainer]: streamDays.includes(date.getDate()),
        })}
        >
          {React.cloneElement(dayComponent, { style: { color: '#3b86ff' } })}
          <div className={classnames({
            [classes.hasStreamDayDot]: streamDays.includes(date.getDate()),
          })}
          />
        </div>
      );
    }

    return dayComponent;
  };

  const platformIcon = (stream: StreamData): JSX.Element => {
    switch (stream.platform) {
      case 'afreeca':
        return (
          <AfreecaIcon />
        );
      case 'twitch':
        return (
          <TwitchIcon />
        );
      case 'youtube':
        return (
          <YoutubeIcon />
        );
      default:
        return <div />;
    }
  };

  const videoName = (datas: any): JSX.Element => {
    switch (datas.startAt) {
      case '12030909':
        return (
          <div className={classes.videoTitle}>기뉴다 롤 RCK 오타쿠를 만났습니다만..?</div>
        );
      case '12021836':
        return (
          <div className={classes.videoTitle}>기뉴다vs이소룡 스타 지면 철구얼굴보기전까지 노방종</div>
        );
      case '12022111':
        return (
          <div className={classes.videoTitle}>기뉴다 미르4 공성전?!! 비곡점령전 무사1위 항왕이 먹겠습니다.</div>
        );
      default:
        return <div className={classes.videoTitle}>기뉴다 스타 마이너즈 허유vs이소룡 탈퇴빵</div>;
    }
  };

  return (
    <div>

      <Box className={classes.paper}>
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
                            {videoName(value)}
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
      </Box>

    </div>
  );
}

export default StreamCalendar;
