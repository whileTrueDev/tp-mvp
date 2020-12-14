import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Fade from '@material-ui/core/Fade';
import useAxios from 'axios-hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
// import * as down from 'js-file-download';
import { useSnackbar } from 'notistack';
// import classnames from 'classnames';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
import ClearIcon from '@material-ui/icons/Clear';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';

// sub components
import Calendar from '../highlightAnalysis/Calendar';
import StreamList from '../highlightAnalysis/StreamList';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';
import TruepointHighlight from '../highlightAnalysis/TruepointHighlight';
import MetricsAccordian from '../highlightAnalysis/MetricsAccordian';
// shared and atoms
import Button from '../../../atoms/Button/Button';
// import Loading from '../../shared/sub/Loading';
import HelperPopOver from '../../shared/HelperPopOver';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import SectionTitle from '../../shared/sub/SectionTitles';
// date expression util
import dateExpression from '../../../utils/dateExpression';
// custom svg icons
import YoutubeIcon from '../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../atoms/stream-analysis-icons/AfreecaIcon';
import Loading from '../../shared/sub/Loading';

export default function HighlightAnalysisLayout(): JSX.Element {
  const classes = useHighlightAnalysisLayoutStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const handleClickedDate = (newDate: Date) => {
    setClickedDate(newDate);
  };

  // 캘린더의 해당 날짜의 방송 데이터들
  const [dayStreamsList, setDayStreamsList] = React.useState<StreamDataType[]>([]);

  const handleDayStreamList = (responseList: StreamDataType[]) => {
    setDayStreamsList(responseList);
  };

  // 캘린더 선택 후 여러 방송 데이터들 중에 분석할 방송의 데이터 선택
  const [selectedStream, setSelectedStream] = React.useState<StreamDataType | null>(null);

  const handleSeletedStreams2 = (
    newStreams: StreamDataType | null,
    base?: true,
  ) => {
    setSelectedStream(newStreams);
  };

  const platformIcon = (stream: StreamDataType): JSX.Element => {
    switch (stream.platform) {
      case 'afreeca':
        return <AfreecaIcon />;
      case 'twitch':
        return <TwitchIcon />;
      case 'youtube':
        return <YoutubeIcon />;
      default:
        return <div />;
    }
  };

  const [highlightData, setHighlightData] = React.useState(null);
  const [isClicked, setIsClicked] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState({
    srtCheckBox: true,
    csvCheckBox: true,
    txtCheckBox: true,
  });

  // 편집점 내보내기 부분 지우지 마세요
  // const [, doExport] = useAxios(
  //   { url: '/highlight/export', method: 'get' }, { manual: true },
  // );

  const [, getHighlightPoints] = useAxios(
    { url: '/highlight/highlight-points', method: 'get' }, { manual: true },
  );

  // 편집점 내보내기 부분 지우지 마세요
  // const makeMonth = (month: number) => {
  //   if (month < 10) {
  //     const edit = `0${month}`;
  //     return edit;
  //   }
  //   const returnMonth = String(month);
  //   return returnMonth;
  // };

  // const makeDay = (day: number) => {
  //   if (day < 10) {
  //     const edit = `0${day}`;
  //     return edit;
  //   }
  //   const returnDay = String(day);
  //   return returnDay;
  // };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked({ ...isChecked, [e.target.name]: e.target.checked });
  };

  // 편집점 내보내기 부분 지우지 마세요
  // const handleExportClick = async () => {
  //   const id = '234175534';
  //   const year = String(selectedStream.fullDate.getFullYear());
  //   const month = makeMonth(selectedStream.fullDate.getMonth() + 1);
  //   const day = makeDay(selectedStream.fullDate.getDate());
  //   const streamId = selectedStream.fileId.split('_')[1].split('.')[0];
  //   const srt = isChecked.srtCheckBox ? 1 : 0;
  //   const csv = isChecked.csvCheckBox ? 1 : 0;
  //   const txt = isChecked.txtCheckBox ? 1 : 0;

  //   // function str2bytes(str: any) {
  //   //   const bytes = new Uint8Array(str.length);
  //   //   for (let i = 0; i < str.length; i += 1) {
  //   //     bytes[i] = str.charCodeAt(i);
  //   //   }
  //   //   return bytes;
  //   // }
  //   doExport({
  //     params: {
  //       id, year, month, day, streamId, srt, txt, csv,
  //     },
  //   })
  //     .then((res) => {
  //       // console.log(res.data);
  //       const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
  //       // const filename = res.headers;
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'test.zip');
  //       document.body.appendChild(link);
  //       link.click();
  //       // setDownloadUrl(url);
  //     }).catch((err) => {
  //       console.error(err);
  //       ShowSnack('지금은 다운로드 할 수 없습니다.', 'error', enqueueSnackbar);
  //     });
  // };

  // S3로부터 선택된 방송의 하이라이트 데이터 패칭
  const fetchHighlightData = async (streamId: string, platform: string, creatorId: string): Promise<void> => {
    setHighlightData(null);
    getHighlightPoints({
      params: {
        streamId,
        platform,
        creatorId,
      },
    })
      .then((res: any) => {
        if (res.data) {
          setHighlightData(res.data);
        }
      }).catch((err) => {
        ShowSnack('highlight :오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
      });
  };

  // [분석하기] 버튼 클릭시 실행 함수
  const handleAnalyze = (): void => {
    setIsClicked(true);
    if (selectedStream) {
      const { streamId, platform, creatorId } = selectedStream;

      Promise.all([fetchHighlightData(streamId, platform, creatorId)])
        .then(() => {
          setIsClicked(false);
        }).catch(() => {
          ShowSnack('데이터를 불러오지 못했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
        });
    } else {
      ShowSnack('하이라이트 포인트를 분석할 방송을 선택해주세요.', 'error', enqueueSnackbar);
    }
  };

  // 카테고리 리스트 요청
  const [{ data: categoriesData }] = useAxios<CategoryGetRequest[]>({
    url: '/category',
  });

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
          <Grid item xs={2} className={classes.title}>
            선택된 방송
          </Grid>
          <Grid item xs={10}>
            {selectedStream
              && (
                <Fade in={Boolean(selectedStream)} style={{ transitionDelay: '200ms' }}>
                  <Card className={classes.card}>
                    <Typography className={classes.cardText}>
                      {dateExpression({
                        compoName: 'analysys-calender',
                        createdAt: new Date(selectedStream.startDate),
                        streamAirtime: selectedStream.airTime,
                      })}
                    </Typography>
                    <IconButton
                      onClick={() => setSelectedStream(null)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Card>
                </Fade>
              )}
          </Grid>

        </Grid>
        <Grid
          item
          xs={12}
          container
          className={classes.calendarWrapper}
          direction="row"
          justify="flex-start"
          spacing={2}
        >
          <Grid item>
            <Calendar
              clickedDate={clickedDate}
              handleClickedDate={handleClickedDate}
              handleDayStreamList={handleDayStreamList}
            />
          </Grid>

          <Grid item xs style={{ marginLeft: 16 }}>
            <StreamList
              dayStreamsList={dayStreamsList}
              selectedStream={selectedStream}
              handleSeletedStreams={handleSeletedStreams2}
              platformIcon={platformIcon}
            />
          </Grid>

        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        className={classes.root}
        justify="flex-end"
      >
        <Grid item container direction="column" style={{ overflow: 'hiden' }}>
          <div className={classes.analysisButton}>
            <Button
              onClick={handleAnalyze}
              disabled={isClicked || Boolean(!selectedStream)}
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
                  disabled
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
                  disabled
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
                  disabled
                />
              )}
              label="csv"
            />
            <Button disabled>
              편집점 내보내기
            </Button>
          </div>

        </Grid>
      </Grid>
      <Loading clickOpen={isClicked} loadingType="medium" />
      { !isClicked && highlightData && categoriesData && (
        <>
          <TruepointHighlight highlightData={highlightData} />
          <MetricsAccordian
            highlightData={highlightData}
            categories={categoriesData}
          />
        </>
      )}
    </Paper>
  );
}
