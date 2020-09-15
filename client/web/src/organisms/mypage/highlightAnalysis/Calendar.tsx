import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import {
  Calendar, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Button from '../../../atoms/Button/Button';

function StreamCalendar(props: any) {
  const { handleDatePick, selectedStream } = props;
  const [selectedDays, setSelectedDays] = React.useState([0]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [{ loading }, getRequest] = useAxios(
    '/highlight/list', { manual: true }
  );
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
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsDate(true);
  };

  const getAllData = async (array: any[]) => {
    const dataArray: number[] = [];
    const promises = array.map((value: any) => dataArray.push(value.startAt.getDate()));
    await Promise.all(promises).then(() => {
      setSelectedDays(dataArray);
    });
  };

  React.useEffect(() => {
    getRequest({
      params: { name: 134859149 }
    }).then((res) => {
      if (res.data) {
        const { streamData } = res.data;
        if (streamData) {
          setSelectedDays(streamData);
        }
      }
    }).catch(() => {
      console.log('데이터호출실패');
    });
  });
  return (
    <Grid container>
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
                  renderDay={(day: any, selectedDate, dayInCurrentMonth, dayComponent) => {
                    const newDate = new Date(day);
                    const isSelected = selectedDays.includes(Number(newDate.getDate()));
                    return (
                      isSelected ? (
                        <div
                          style={{
                            backgroundColor: '#a6c1f9',
                          }}
                        >
                          {dayComponent}
                        </div>
                      ) : (<div>{dayComponent}</div>)
                    );
                  }}
                />
              </Grid>
              {isDate ? (
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    spacing={3}
                  >
                    <div>
                      {testJson.map((value) => (
                        (selectedDate && selectedDate.getDate() === value.startAt.getDate()) ? (
                          <Grid item key={value.streamId}>
                            <Button
                              style={{
                                width: '32vw', marginLeft: 30, justifyItems: 'flex-start', backgroundColor: '#a6c1f9'
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
    </Grid>
  );
}

export default StreamCalendar;
