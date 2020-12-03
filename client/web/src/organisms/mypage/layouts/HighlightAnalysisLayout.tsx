import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import useAxios from 'axios-hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
// import * as down from 'js-file-download';
import { useSnackbar } from 'notistack';
// import classnames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
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
// import SearchBox from '../highlightAnalysis/SearchBox';

interface StreamDate {
  fullDate: Date;
  startAt: string;
  finishAt: string;
  fileId: string;
}

// interface PointType {
//   start_time: string;
//   end_time: string;
//   start_index: number;
//   end_index: number;
//   score: any;
// }

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
  // const [metricsData, setMetricsData] = React.useState(null);
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
  // const [, getMetricsData] = useAxios(
  //   { url: '/highlight/metrics', method: 'get' }, { manual: true },
  // );
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

  function forloop(datas: any): any {
    const { highlight_points, chat_points, smile_points } = datas;

    const new_points = highlight_points.highlight_points.map((point: any) => ({
      ...point,
      start_date: `2020-12-01 ${point.start_date}`,
      end_date: `2020-12-01 ${point.end_date}`,
    }));

    const new_points_90 = highlight_points.highlight_points_90.map((point: any) => ({
      ...new_points[point],
    }));
    // const new_points = highlight_points.map((point: any) => ({
    //   ...point,
    //   start_date: `2020-12-01 ${point.start_date}`,
    //   end_date: `2020-12-01 ${point.end_date}`,
    // }));

    const new_chat_points = chat_points.highlight_points.map((point: any) => ({
      ...point,
      start_date: `2020-12-01 ${point.start_date}`,
      end_date: `2020-12-01 ${point.end_date}`,
    }));

    const new_chat_points_90 = chat_points.highlight_points_90.map((point: any) => ({
      ...new_chat_points[point],
    }));

    const new_smile_points = smile_points.highlight_points.map((point: any) => ({
      ...point,
      start_date: `2020-12-01 ${point.start_date}`,
      end_date: `2020-12-01 ${point.end_date}`,
    }));

    const new_smile_points_90 = smile_points.highlight_points_90.map((point: any) => ({
      ...new_smile_points[point],
    }));

    return {
      highlight_points: new_points_90.length >= 10 ? new_points_90 : new_points,
      chat_points: new_chat_points_90.length >= 10 ? new_chat_points_90 : new_chat_points,
      smile_points: new_smile_points_90.length >= 10 ? new_smile_points_90 : new_smile_points,
    };
    // console.log(new_points);
  }

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
          const final = forloop(res.data);
          setHighlightData(final);
        }
      }).catch((err) => {
        ShowSnack('highlight :오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  // const fetchMetricsData = async (
  //   id: string, year: string, month: string, day: string, fileId: string): Promise<void> => {
  //   setMetricsData(null);
  //   getMetricsData(
  //     {
  //       params: {
  //         id, year, month, day, fileId,
  //       },
  //     },
  //   )
  //     .then((res) => {
  //       if (res.data) {
  //         console.log(res.data);
  //         setMetricsData(getMetricsPoint(res.data));
  //       }
  //     }).catch(() => {
  //       ShowSnack('metrics :오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
  //     });
  // };

  const handleAnalyze = (): void => {
    setIsClicked(true);
    const id = '234175534';
    const year = String(selectedStream.fullDate.getFullYear());
    const month = makeMonth(selectedStream.fullDate.getMonth() + 1);
    const day = makeDay(selectedStream.fullDate.getDate());
    const file = selectedStream.fileId;

    Promise.all([
      fetchHighlightData(id, year, month, day, file),
      // fetchMetricsData(id, year, month, day, file)
    ])
      .then(() => {
        setIsClicked(false);
      }).catch(() => {
        ShowSnack('데이터를 불러오지 못했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  // const dummy: string[] = [
  //   '나락',
  //   '극락',
  //   '굿',
  //   '지렷다',
  //   '레전드',
  //   '노답',
  //   '가능?',
  //   '침디',
  //   '가장긴 문자열',
  // ];

  // const [analysisWord, setAnalysisWord] = React.useState<string>();
  // const handleAnalysisWord = (targetWord: string) => {
  //   setAnalysisWord(targetWord);
  // };

  return (
    <Paper className={classes.root}>
      <Grid
        container
        direction="column"
      >
        <Grid item xs={12} className={classes.wraper}>
          <SectionTitle mainTitle="편집점 분석" />
          <Typography variant="body1" className={classes.sub}>
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
          className={classes.sideSpace}
        >
          <Grid item xs={3} className={classes.title}>
            선택된 방송
          </Grid>
          <Grid item xs={9}>
            {selectedStream.fileId
              && (
                <Card className={classes.card}>
                  <Typography className={classes.cardText}>
                    {dateExpression({
                      compoName: 'highlight-calendar',
                      createdAt: (selectedStream.startAt),
                      finishAt: (selectedStream.finishAt),
                    })}
                  </Typography>

                  <IconButton
                    onClick={() => setSelectedStream({ ...selectedStream, fileId: '' })}
                  >
                    <ClearIcon />
                  </IconButton>
                </Card>
              )}
          </Grid>

        </Grid>
        <Grid
          item
          xs={12}
          container
          className={classes.wraper}
          direction="column"
          justify="flex-start"
        >
          <Calendar handleDatePick={handleDatePick} />
        </Grid>
        {/* 
        <Grid
          item
          xs
          className={classnames({
            [classes.title]: true,
            [classes.searchTitle]: true,
          })}
        >
          분석할 검색값 입력
        </Grid>

        <div className={classes.searchBox}>
          <SearchBox
            words={dummy}
            handleAnalysisWord={handleAnalysisWord}
            analysisWord={analysisWord}
          />
        </div> */}
      </Grid>

      <Grid
        item
        container
        xs={12}
        className={classes.root}
        justify="flex-end"
      >
        <Grid item direction="column" style={{ overflow: 'hiden' }}>
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
      <Loading clickOpen={isClicked} loadingType="medium" />
      {/* { !isClicked && highlightData && metricsData && ( */}
      { !isClicked && highlightData && (
        <>
          <TruepointHighlight highlightData={highlightData} />
          <MetricsAccordian
            metricsData={highlightData}
            // analysisWord="편집점"
          />
        </>
      )}
    </Paper>
  );
}
