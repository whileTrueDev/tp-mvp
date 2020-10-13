import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import useAxios from 'axios-hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import * as down from 'js-file-download';
import Calendar from '../highlightAnalysis/Calendar';
import Button from '../../../atoms/Button/Button';
import Card from '../../../atoms/Card/Card';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';
import TruepointHighlight from '../highlightAnalysis/TruepointHighlight';
import MetricsAccordian from '../highlightAnalysis/MetricsAccordian';
import Loading from '../../shared/sub/Loading';

interface StreamDate {
  fullDate: Date;
  startAt: string;
  finishAt: string;
  fileId: string;
}

interface PointType {
  start_time: string;
  end_time: string;
  start_index: number;
  end_index: number;
  score: any;
}

export default function HighlightAnalysisLayout(): JSX.Element {
  const classes = useHighlightAnalysisLayoutStyles();

  const data: StreamDate = {
    fullDate: new Date(),
    startAt: '',
    finishAt: '',
    fileId: '',
  };
  const [highlightData, setHighlightData] = React.useState(null);
  const [metricsData, setMetricsData] = React.useState(null);
  const [selectedStream, setSelectedStream] = React.useState<StreamDate>(data);
  const [isClicked, setIsClicked] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState({
    srtCheckBox: true,
    csvCheckBox: true,
    txtCheckBox: true,
  });
  // const [downloadUrl, setDownloadUrl] = React.useState<string>('');
  const handleDatePick = (fullDate: Date, startAt: string, finishAt: string, fileId: string) => {
    // const streamId = fileId.split('_')[2].split('.')[0];
    setSelectedStream({
      fullDate,
      startAt,
      finishAt,
      fileId,
    });
  };
  const [, doExport] = useAxios(
    { url: '/highlight/export', method: 'get' }, { manual: true },
  );
  const [, getHighlightPoints] = useAxios(
    { url: '/highlight/highlight-points', method: 'get' }, { manual: true },
  );
  const [, getMetricsData] = useAxios(
    { url: '/highlight/metrics', method: 'get' }, { manual: true },
  );
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

  // Metrics 데이터 전처리 함수
  const getMetricsPoint = (metric: any): any => {
    const originStartTime = new Date(metric.start_date);

    function getDate(index: number) {
      const Time = new Date(originStartTime.setSeconds(originStartTime.getSeconds() + 30 * index));
      const getYears = Time.getFullYear();
      const getMonths = Time.getMonth();
      const getDays = Time.getDay();
      const getHours = Time.getHours();
      const getMinutes = Time.getMinutes();
      const getSeconds = Time.getSeconds();
      const months = getMonths >= 10 ? String(getMonths) : `0${getMonths}`;
      const days = getDays >= 10 ? String(getDays) : `0${getDays}`;
      const hours = getHours >= 10 ? String(getHours) : `0${getHours}`;
      const minutes = getMinutes >= 10 ? String(getMinutes) : `0${getMinutes}`;
      const seconds = getSeconds >= 10 ? String(getSeconds) : `0${getSeconds}`;

      return `${getYears}-${months}-${days} ${hours}:${minutes}:${seconds}`;
    }

    function insertPoints(target: number, countType: string) {
      const time = getDate(target);
      const returnDict = {
        start_time: time,
        end_time: time,
        start_index: target,
        end_index: target,
        score: metric.time_line[target][countType],
      };
      return returnDict;
    }

    const resultData: {chat_points: PointType[]; smile_points: PointType[]} = {
      chat_points: [],
      smile_points: [],
    };

    const chatHighlight = metric.chat_points;
    const smileHighlight = metric.smile_points;

    chatHighlight.forEach((item: number) => {
      const eachData = insertPoints(item, 'chat_count');
      resultData.chat_points.push(eachData);
    });

    smileHighlight.forEach((item: number) => {
      const eachData = insertPoints(item, 'smile_count');
      resultData.smile_points.push(eachData);
    });

    return resultData;
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
    doExport({
      params: {
        id, year, month, day, streamId, srt, txt, csv,
      },
    })
      .then((res) => {
        // console.log(res.data);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
        // const filename = res.headers;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'test.zip');
        document.body.appendChild(link);
        link.click();
        // setDownloadUrl(url);
      }).catch((err) => {
        console.error(err);
        alert('지금은 다운로드 할 수 없습니다.');
      });
  };
  const fetchHighlightData = async (
    id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    // 134859149/2020/08/01/09161816_09162001_39667416302.json
    getHighlightPoints({
      params: {
        id, year, month, day, fileId,
      },
    })
      .then((res) => {
        if (res.data) {
          setHighlightData(res.data);
        }
      }).catch(() => {
        alert('highlight :오류가 발생했습니다. 잠시 후 다시 이용해주세요.');
      });
  };

  const fetchMetricsData = async (
    id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    getMetricsData(
      {
        params: {
          id, year, month, day, fileId,
        },
      },
    )
      .then((res) => {
        if (res.data) {
          setMetricsData(getMetricsPoint(res.data));
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
    <Paper className={classes.root}>
      <Grid
        container
        direction="column"
      >
        <Grid item xs={12} className={classes.root}>
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
          item
          xs={12}
          container
          direction="row"
          alignItems="center"
        >
          <Grid item xs={12} className={classes.root}>
            <Typography variant="h4" className={classes.checkedStreamFont}>
              선택된 방송 &gt;
            </Typography>
          </Grid>
          <Grid item>
            {selectedStream.fileId
              && (
                <Card className={classes.card}>
                  <Typography className={classes.cardText}>
                    {`${`${String(selectedStream.startAt).slice(2, 4)}일  ${selectedStream.startAt.slice(4, 6)}:${selectedStream.startAt.slice(6, 8)}`} ~ ${String(selectedStream.finishAt).slice(2, 4)}일  ${`${selectedStream.finishAt.slice(4, 6)}:${selectedStream.finishAt.slice(6, 8)}`}`}
                  </Typography>
                </Card>
              )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          className={classes.root}
          direction="column"
          justify="flex-start"
        >
          <Calendar handleDatePick={handleDatePick} />
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        className={classes.root}
        justify="flex-end"
      >
        <Grid item direction="column">
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={handleAnalyze}
              disabled={isClicked || Boolean(!selectedStream.fileId)}
            >
              분석하기
            </Button>
          </div>
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
              disabled={isClicked || Boolean(!selectedStream.fileId)}
            >
              편집점 내보내기
            </Button>
          </div>
        </Grid>
      </Grid>
      <Loading clickOpen={isClicked} lodingTime={10000} />
      { !isClicked && highlightData && metricsData && (
        <>
          <TruepointHighlight highlightData={highlightData} />
          <MetricsAccordian metricsData={metricsData} />
        </>
      )}
    </Paper>
  );
}
