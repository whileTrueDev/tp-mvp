import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import useAxios from 'axios-hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import * as down from 'js-file-download';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import { Chip } from '@material-ui/core';
import Calendar from '../highlightAnalysis/Calendar';
import Button from '../../../atoms/Button/Button';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';
import TruepointHighlight from '../highlightAnalysis/TruepointHighlight';
import MetricsAccordian from '../highlightAnalysis/MetricsAccordian';
import Loading from '../../shared/sub/Loading';
import HelperPopOver from '../../shared/HelperPopOver';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import SectionTitle from '../../shared/sub/SectionTitles';
import dateExpression from '../../../utils/dateExpression';
import SearchBox from '../highlightAnalysis/SearchBox';

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
  const { enqueueSnackbar } = useSnackbar();

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
        ShowSnack('지금은 다운로드 할 수 없습니다.', 'error', enqueueSnackbar);
      });
  };
  const fetchHighlightData = async (
    id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    // 134859149/2020/08/01/09161816_09162001_39667416302.json
    setHighlightData(null);
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
        ShowSnack('highlight :오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  const fetchMetricsData = async (
    id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
    setMetricsData(null);
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
        ShowSnack('metrics :오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
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
        ShowSnack('데이터를 불러오지 못했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  const dummy: string[] = [
    '나락',
    '극락',
    '굿',
    '지렷다',
    '레전드',
    '노답',
    '가능?',
    '침디',
    '가장긴 문자열',
  ];
  const [analysisWord, setAnalysisWord] = React.useState<string>();
  const handleAnalysisWord = (targetWord: string) => {
    setAnalysisWord(targetWord);
  };

  return (
    <Paper className={classes.root}>
      <Grid container direction="column">
        <Grid item xs={12} className={classes.wraper}>
          <SectionTitle mainTitle="편집점 분석" />
          <Typography variant="body2" color="textSecondary">
            방송을 선택하시면 편집점 분석을 시작합니다.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="row"
          alignItems="center"
          justify="space-between"
          className={classes.wraper}
        >
          <div className={classes.title}>
            <Typography variant="body1" className={classes.titleText}>선택된 방송 &gt;</Typography>
            {selectedStream.fileId
            && (
              <Chip
                label={dateExpression({
                  compoName: 'highlight-calendar',
                  createdAt: (selectedStream.startAt),
                  finishAt: (selectedStream.finishAt),
                })}
                className={classes.chip}
                color="primary"
                onDelete={() => setSelectedStream({ ...selectedStream, fileId: '' })}
              />
            )}
          </div>
        </Grid>

        <Grid item xs={12} className={classes.wraper}>
          <Calendar handleDatePick={handleDatePick} />
        </Grid>

        <Grid item xs className={classnames(classes.wraper, classes.searchTitle)}>
          <Typography variant="body1" className={classes.titleText}>분석할 검색값 입력</Typography>
        </Grid>

        <Grid item xs className={classnames(classes.wraper, classes.searchTitle)}>
          <SearchBox
            words={dummy}
            handleAnalysisWord={handleAnalysisWord}
            analysisWord={analysisWord}
          />
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        className={classes.root}
        justify="flex-end"
      >
        <Grid item style={{ overflow: 'hiden' }}>
          <div className={classes.analysisButton}>
            <Button
              onClick={handleAnalyze}
              disabled={isClicked || Boolean(!selectedStream.fileId)}
            >
              분석하기
            </Button>
          </div>
          <div className={classes.helperPopOver}>
            <HelperPopOver />
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
      <Loading clickOpen={isClicked} />
      { !isClicked && highlightData && metricsData && (
        <>
          <TruepointHighlight highlightData={highlightData} />
          <MetricsAccordian
            metricsData={metricsData}
            analysisWord={analysisWord}
          />
        </>
      )}
    </Paper>
  );
}
