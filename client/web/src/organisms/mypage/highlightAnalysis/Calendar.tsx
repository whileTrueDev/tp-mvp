import React, { useCallback } from 'react';
import { Paper, Typography, makeStyles } from '@material-ui/core';
import useAxios from 'axios-hooks';
import {
  Calendar, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useSnackbar } from 'notistack';

import DateFnsUtils from '@date-io/date-fns';
import koLocale from 'date-fns/locale/ko';
import Grid from '@material-ui/core/Grid';
import Button from '../../../atoms/Button/Button';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import dateExpression from '../../../utils/dateExpression';

interface StreamData {
  getState: boolean;
  startAt: string;
  finishAt: string;
  fileId: string;
}

const useStyles = makeStyles((theme) => ({
  day: {
    backgroundColor: theme.palette.primary.light,

  },
}));

export interface StreamCalenderProps {
  handleDatePick: (selectedDate: Date, startAt: string, finishAt: string, fileId: string) => void;
}
function StreamCalendar({ handleDatePick }: StreamCalenderProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const getStreamData: StreamData[] = new Array<StreamData>();
  const [streamDays, setStreamDays] = React.useState([0]);
  const [streamData, setStreamData] = React.useState<StreamData[]>(getStreamData);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(Date.now()),
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDataLoading, setDataIsLoading] = React.useState(true);
  const [, setSelectedDay] = React.useState(0);
  const [isDate, setIsDate] = React.useState(false);
  const [, getHighlightList] = useAxios(
    { url: '/highlight/list' }, { manual: true },
  );
  const [, getStreamList] = useAxios(
    { url: '/highlight/stream' }, { manual: true },
  );
  const fetchListData = useCallback(async (name: string, year: string, month: string): Promise<void> => {
    getHighlightList({
      params: {
        name, year, month,
      },
    }).then((res) => {
      if (res.data) {
        setStreamDays(res.data);
        setIsLoading(false);
      }
    }).catch(() => {
      ShowSnack('오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
    });
  }, [getHighlightList, enqueueSnackbar]);

  const fetchStreamData = async (name: string, year: string, month: string, day: string): Promise<void> => {
    // 달력-> 날짜 선택시 해당 일의 방송을 로드
    getStreamList({
      params: {
        name, year, month, day,
      },
    })
      .then((res) => {
        if (res.data.length !== 0) {
          setStreamData(res.data);
        } else {
          setStreamData([{
            getState: false, startAt: '', finishAt: '', fileId: '',
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
      fetchListData('234175534', year, editMonth);
      resolve();
    }
  });

  const handleDateChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
    if (date) {
      const year = String(date.getFullYear());
      const month = makeDay(date.getMonth() + 1);
      const day = makeDay(date.getDate());
      fetchStreamData('234175534', year, month, day);
      setSelectedDay(Number(day));
      setSelectedDate(date);
      setIsDate(true);
      setDataIsLoading(false);
    }
    resolve();
  });

  React.useEffect(() => {
    fetchListData('234175534', '2020', '09');
  }, [fetchListData]);
  return (
    <div>
      {!isLoading ? (
        <Paper style={{ padding: 20 }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
            <Typography variant="h5">
              날짜선택
            </Typography>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Calendar
                  date={selectedDate}
                  onChange={handleDateChange}
                  disableFuture
                  onMonthChange={handleMonthChange}
                  renderDay={(day: any, selected, dayInCurrentMonth, dayComponent) => {
                    const newDate = new Date(day);
                    const isStream = streamDays.includes(Number(newDate.getDate()));
                    return (
                      (isStream && dayInCurrentMonth) ? (
                        <div
                          className={classes.day}
                        >
                          {dayComponent}
                        </div>
                      ) : (<div>{dayComponent}</div>)
                    );
                  }}
                />
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
                                width: '32vw', marginLeft: 32, justifyItems: 'flex-start', backgroundColor: '#theme.palette.primary.light',
                              }}
                              id={value.fileId}
                              onClick={() => {
                                handleDatePick(selectedDate, value.startAt, value.finishAt, value.fileId);
                              }}
                            >
                              {dateExpression({
                                compoName: 'highlight-calendar',
                                createdAt: new Date(value.startAt),
                                finishAt: new Date(value.finishAt),
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
        </Paper>
      ) : null}
    </div>
  );
}

export default StreamCalendar;
