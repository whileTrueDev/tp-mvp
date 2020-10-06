import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import * as down from 'js-file-download';
import Calendar from '../highlightAnalysis/Calendar';
import Button from '../../../atoms/Button/Button';
import Card from '../../../atoms/Card/Card';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';
import TruepointHighlight from '../highlightAnalysis/TruepointHighlight';
import MetricsAccordian from '../highlightAnalysis/MetricsAccordian';

interface StreamDate {
  fullDate: Date,
  startAt: string,
  finishAt: string,
  fileId: string,
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
    fileId: '',
  };
  const [selectedStream, setSelectedStream] = React.useState<StreamDate>(data);
  const [isClicked, setIsClicked] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState({
    srtCheckBox: true,
    csvCheckBox: true,
    txtCheckBox: true,
  });
  const [downloadUrl, setDownloadUrl] = React.useState<string>('');
  const handleDatePick = (fullDate: Date, startAt: string, finishAt: string, fileId: string) => {
    // const streamId = fileId.split('_')[2].split('.')[0];
    setSelectedStream({
      fullDate,
      startAt,
      finishAt,
      fileId,
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
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked({ ...isChecked, [e.target.name]: e.target.checked });
  };

  const handleExportClick = async () => {
    const id = '234175534';
    const year = String(selectedStream.fullDate.getFullYear());
    const month = makeMonth(selectedStream.fullDate.getMonth() + 1);
    const day = makeDay(selectedStream.fullDate.getDate());
    const streamId = selectedStream.fileId.split('_')[1].split('.')[0];
    const srt = isChecked.srtCheckBox ? 1 : 0;
    const csv = isChecked.csvCheckBox ? 1 : 0;
    const txt = isChecked.txtCheckBox ? 1 : 0;

    // function str2bytes(str: any) {
    //   const bytes = new Uint8Array(str.length);
    //   for (let i = 0; i < str.length; i += 1) {
    //     bytes[i] = str.charCodeAt(i);
    //   }
    //   return bytes;
    // }
    const result = await axios.get('/highlight/export',
      {
        params: {
          id, year, month, day, streamId, srt, txt, csv
        },
      })
      .then((res) => {
        console.log(res.data);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
        const filename = res.headers;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'test.zip');
        document.body.appendChild(link);
        link.click();
        setDownloadUrl(url);
      }).catch((err) => {
        console.log(err);
        alert('지금은 다운로드 할 수 없습니다.');
      });
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
        alert('highlight :오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const fetchMetricsData = async (id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
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
        alert('metrics :오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const handleAnalyze = (): void => {
    setIsClicked(true);
    const id = '234175534';
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
              <div>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isChecked.srtCheckBox}
                      onChange={handleCheckbox}
                      name="srtCheckBox"
                      color="primary"
                    />
                  )}
                  label="srt"
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isChecked.txtCheckBox}
                      onChange={handleCheckbox}
                      name="txtCheckBox"
                      color="primary"
                    />
                  )}
                  label="txt"
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isChecked.csvCheckBox}
                      onChange={handleCheckbox}
                      name="csvCheckBox"
                      color="primary"
                    />
                  )}
                  label="csv"
                />
                <Button
                  onClick={handleExportClick}
                >
                  편집점 내보내기
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
      <TruepointHighlight />
      <MetricsAccordian />
    </Grid>
  );
}
