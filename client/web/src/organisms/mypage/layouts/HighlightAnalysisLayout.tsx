import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';

import Calendar from '../highlightAnalysis/Calendar';
import Button from '../../../atoms/Button/Button';
import Card from '../../../atoms/Card/Card';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';

interface StreamDate {
  fullDate: Date,
  startAt: string,
  finishAt: string,
  fileId: string
}

export default function HighlightAnalysisLayout(): JSX.Element {
  const classes = useHighlightAnalysisLayoutStyles();
  const axios = Axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });
  const data: StreamDate = {
    fullDate: new Date(),
    startAt: '',
    finishAt: '',
    fileId: ''
  };
  const [selectedStream, setSelectedStream] = React.useState<StreamDate>(data);
  const [isClicked, setIsClicked] = React.useState(false);
  const handleDatePick = (fullDate: Date, startAt: string, finishAt: string, fileId: string) => {
    setSelectedStream({
      fullDate,
      startAt,
      finishAt,
      fileId
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

  const fetchHighlightData = async (id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    // 134859149/2020/08/01/09161816_09162001_39667416302.json
    const result = await axios.get('/highlight/highlight-points',
      {
        params: {
          id, year, month, day, fileId
        }
      })
      .then((res) => {
        if (res.data) {
          // 데이터 리턴값
          console.log(res.data);
        }
      }).catch(() => {
        alert('오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const fetchMetricsData = async (id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    // 134859149/2020/08/01/09161816_09162001_39667416302.json
    const result = await axios.get('/highlight/metrics',
      {
        params: {
          id, year, month, day, fileId
        }
      })
      .then((res) => {
        if (res.data) {
          // 데이터 리턴값
          console.log(res.data);
        }
      }).catch(() => {
        alert('오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const handleAnalyze = (): void => {
    setIsClicked(true);
    const id = '134859149';
    const year = String(selectedStream.fullDate.getFullYear());
    const month = makeMonth(selectedStream.fullDate.getMonth() + 1);
    const day = makeDay(selectedStream.fullDate.getDate());
    const file = selectedStream.fileId;
    Promise.all([
      fetchHighlightData(id, year, month, day, file),
      fetchMetricsData(id, year, month, day, file)])
      .then(() => {
        setIsClicked(false);
      }).catch(() => {
        alert('데이터를 불러오지 못했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  return (
    <Grid
      container
      direction="column"
    >
      <Paper className={classes.root}>
        <Grid item className={classes.root}>
          <Grid item xs={3}>
            <Divider variant="middle" component="hr" />
          </Grid>
          <Typography variant="h4" className={classes.title}>
            편집점 분석
          </Typography>
          <Typography variant="body1" className={classes.sub}>
            방송을 선택하시면 편집점 분석을 시작합니다.
          </Typography>
          <Divider variant="middle" />
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
        >
          <Grid item className={classes.root}>
            <Typography variant="h4" className={classes.checkedStreamFont}>
              선택된 방송 &gt;
            </Typography>
          </Grid>
          <Grid item>
            {selectedStream.fileId
              ? (
                <Card className={classes.card}>
                  <Typography className={classes.cardText}>
                    {`${`${String(selectedStream.startAt).slice(2, 4)}일  ${selectedStream.startAt.slice(4, 6)}:${selectedStream.startAt.slice(6, 8)}`} ~ ${String(selectedStream.finishAt).slice(2, 4)}일  ${`${selectedStream.finishAt.slice(4, 6)}:${selectedStream.finishAt.slice(6, 8)}`}`}
                  </Typography>
                </Card>
              ) : (null)}
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-end"
        >
          <Grid item className={classes.root}>
            <Calendar
              handleDatePick={handleDatePick}
              setSelectedStream={setSelectedStream}
              selectedStream={selectedStream}
            />
          </Grid>
          <Grid item xs={3}>
            <div>
              <Button
                onClick={handleAnalyze}
                disabled={isClicked || Boolean(!selectedStream.fileId)}
              >
                분석하기
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
