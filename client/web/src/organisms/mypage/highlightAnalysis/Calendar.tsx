import React from 'react';
import { Paper, Typography, makeStyles } from '@material-ui/core';
import useAxios from 'axios-hooks';
import {
  Calendar, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Button from '../../../atoms/Button/Button';

interface StreamData {
  getState: boolean,
  startAt: string,
  finishAt: string,
  fileId: string
}

const useStyles = makeStyles((theme) => ({
  day: {
    backgroundColor: theme.palette.primary.light,

  }
}));

function StreamCalendar(props: any) {
  const classes = useStyles();
  const getStreamData: StreamData[] = new Array<StreamData>();
  const { handleDatePick } = props;
  const [streamDays, setStreamDays] = React.useState([0]);
  const [streamData, setStreamData] = React.useState<StreamData[]>(getStreamData);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDataLoading, setDataIsLoading] = React.useState(true);
  const [selectedDay, setSelectedDay] = React.useState(0);
  const [isDate, setIsDate] = React.useState(false);
  const [, getHighlightList] = useAxios(
    { url: '/highlight/list' }, { manual: true }
  );
  const [, getStreamList] = useAxios(
    { url: '/highlight/stream' }, { manual: true }
  );
  const fetchListData = async (name: string, year: string, month: string): Promise<void> => {
    getHighlightList({
      params: {
        name, year, month
      }
    }).then((res) => {
      if (res.data) {
        setStreamDays(res.data);
        setIsLoading(false);
      }
    }).catch(() => {
      alert('오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
    });
  };

  const fetchStreamData = async (name: string, year: string, month: string, day: string): Promise<void> => {
    // 달력-> 날짜 선택시 해당 일의 방송을 로드
    getStreamList({
      params: {
        name, year, month, day
      }
    })
      .then((res) => {
        if (res.data.length !== 0) {
          setStreamData(res.data);
        } else {
          setStreamData([{
            getState: false, startAt: '', finishAt: '', fileId: ''
          }]);
        }
      }).catch(() => {
        alert('방송목록을 불러오지 못했습니다. 잠시 후 다시 이용해주세요.');
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
  }, []);
  return (
    <Grid container>
      {!isLoading ? (
        <Grid item xs={12}>
          <Paper style={{ width: '50vw', padding: 20 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                    renderDay={(day: any, selectedDate, dayInCurrentMonth, dayComponent) => {
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
                                  width: '32vw', marginLeft: 32, justifyItems: 'flex-start', backgroundColor: '#theme.palette.primary.light'
                                }}
                                id={value.fileId}
                                onClick={() => {
                                  handleDatePick(selectedDate, value.startAt, value.finishAt, value.fileId);
                                }}
                              >
                                {`${`${String(value.startAt).slice(2, 4)}일  ${value.startAt.slice(4, 6)}:${value.startAt.slice(6, 8)}`} ~ ${String(value.finishAt).slice(2, 4)}일  ${`${value.finishAt.slice(4, 6)}:${value.finishAt.slice(6, 8)}`}`}
                              </Button>
                            </Grid>
                          )
                            : null
                        ))}
                      </div>
                    </Grid>
                  </Grid>
                )
                  : (
                    <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        날짜를 선택해주세요.
                      </Typography>
                    </div>
                  )}
              </Grid>
            </MuiPickersUtilsProvider>
          </Paper>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default StreamCalendar;
