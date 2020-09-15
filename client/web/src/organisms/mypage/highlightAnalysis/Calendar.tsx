import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import Axios from 'axios';
import {
  Calendar, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Button from '../../../atoms/Button/Button';

function StreamCalendar(props: any) {
  const { handleDatePick } = props;
  const [streamDays, setStreamDays] = React.useState([0]);
  const [streamData, setStreamData] = React.useState({});
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDataLoading, setDataIsLoading] = React.useState(true);

  const axios = Axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });

  const testJson = [
    {
      startAt: new Date('2020-09-09T21:11:54'),
      finishAt: new Date('2020-09-09T23:11:54'),
      streamId: '123123',
      streamTitle: 'ㄴ아런이ㅏ렁니ㅏ'
    },
    {
      startAt: new Date('2020-09-10T18:11:54'),
      finishAt: new Date('2020-09-10T19:11:54'),
      streamId: '2323232',
      streamTitle: 'ㅇ니;러ㅣㅏㅁ너아ㅣ'
    }
  ];
  const [isDate, setIsDate] = React.useState(false);

  const fetchListData = async (name: string, year: string, month: string): Promise<void> => {
    const result = await axios.get('/highlight/list',
      { params: { name, year, month } })
      .then((res) => {
        if (res.data) {
          setStreamDays(res.data);
          setIsLoading(false);
        }
      }).catch(() => {
        alert('오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const fetchStreamData = async (name: string, year: string, month: string, day: string): Promise<void> => {
    const result = await axios.get('/highlight/stream',
      {
        params: {
          name, year, month, day
        }
      })
      .then((res) => {
        if (res.data) {
          setStreamData(res.data);
        }
      }).catch(() => {
        alert('오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
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
      fetchListData('134859149', year, editMonth);
      resolve();
    }
  });

  const handleDateChange = async (date: Date | null): Promise<void> => new Promise((resolve) => {
    // fetchStreamData(date);
    if (date) {
      const year = String(date.getFullYear());
      const month = makeDay(date.getMonth() + 1);
      const day = makeDay(date.getDate());
      fetchStreamData('134859149', year, month, day);
      setSelectedDate(date);
      setIsDate(true);
      setDataIsLoading(false);
    }
    resolve();
  });
  // const getAllData = async (array: any[]) => {
  //   const dataArray: number[] = [];
  //   const promises = array.map((value: any) => dataArray.push(value.startAt.getDate()));
  //   await Promise.all(promises).then(() => {
  //     setStreamDays(dataArray);
  //   });
  // };

  React.useEffect(() => {
    fetchListData('134859149', '2020', '09');
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
                      const isStream = streamDays.includes(newDate.getDate());
                      return (
                        isStream ? (
                          <div
                            style={{
                              backgroundColor: '#theme.palette.primary.light',
                            }}
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
                      {/* <div>
                        {streamData.map((value) => (
                          (selectedDate && selectedDate.getDate() === value.startAt.getDate()) ? (
                            <Grid item key={value.streamId}>
                              <Button
                                style={{
                                  width: '32vw', marginLeft: 30, justifyItems: 'flex-start', backgroundColor: '#theme.palette.primary.light'
                                }}
                                id={value.streamId}
                                onClick={(e) => {
                                  handleDatePick(value.startAt, value.finishAt, value.streamId, e);
                                }}
                              >
                                {`${`${String(value.startAt.getDate())}일  ${value.startAt.getHours()}:${value.startAt.getMinutes()}`} ~ ${String(value.startAt.getDate())}일  ${`${value.finishAt.getHours()}:${value.finishAt.getMinutes()}`}`}
                              </Button>
                            </Grid>
                          ) : null
                        ))}
                      </div> */}
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
