import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import useAxios from 'axios-hooks';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
// import * as down from 'js-file-download';
import { useSnackbar } from 'notistack';
import { Chip } from '@material-ui/core';
import Calendar from '../highlightAnalysis/Calendar';
import StreamList from '../highlightAnalysis/StreamList';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';
import TruepointHighlight from '../highlightAnalysis/TruepointHighlight';
import MetricsAccordian from '../highlightAnalysis/MetricsAccordian';
// shared and atoms
import Button from '../../../atoms/Button/Button';
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

  // 하이라이트 구간 요청
  const [, getHighlightPoints] = useAxios(
    { url: '/highlight/highlight-points', method: 'get' }, { manual: true },
  );

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
        ShowSnack('분석 도중 오류가 발생했습니다. 잠시 후 다시 이용해주세요.', 'error', enqueueSnackbar);
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
      <Grid container direction="column">
        <Grid item xs={12} className={classes.wraper}>
          <SectionTitle mainTitle="편집점 분석" />
          <Typography variant="body2" color="textSecondary">
            방송을 선택하시면 편집점 분석을 시작합니다.
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="flex-start"
          className={classes.wraper}
        >
          <Grid item xs={12} className={classes.selectedStream}>
            <Typography className={classes.selectedStreamTitle}>선택된 방송 &gt;</Typography>
            {selectedStream && (
            <Chip
              size="medium"
              onDelete={() => setSelectedStream(null)}
              label={(
                <div className={classes.chip}>
                  <ListItemIcon>
                    {platformIcon(selectedStream)}
                  </ListItemIcon>
                  <Typography className={classes.cardText}>
                    {dateExpression({
                      compoName: 'analysys-calender',
                      createdAt: new Date(selectedStream.startDate),
                    })}
                  </Typography>
                  <Typography className={classes.listItemText} style={{ marginLeft: '24px' }} display="inline">
                    {selectedStream.title.length > 20 ? `${selectedStream.title.slice(0, 21)} ...` : selectedStream.title}
                  </Typography>
                </div>
              )}
            />
            )}
          </Grid>

        </Grid>
        <Grid
          container
          className={classes.calendarWrapper}
          direction="row"
        >
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 32 }}>
              <Calendar
                clickedDate={clickedDate}
                handleClickedDate={handleClickedDate}
                handleDayStreamList={handleDayStreamList}
              />
            </div>
            <StreamList
              dayStreamsList={dayStreamsList}
              selectedStream={selectedStream}
              handleSeletedStreams={handleSeletedStreams2}
              platformIcon={platformIcon}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        className={classes.root}
        justify="flex-end"
      >
        <Grid container direction="row" justify="center">
          <div>
            <Button
              onClick={handleAnalyze}
              disabled={isClicked || Boolean(!selectedStream)}
            >
              분석하기
            </Button>
          </div>
        </Grid>
      </Grid>
      <Loading clickOpen={isClicked} />
      { !isClicked && highlightData && categoriesData && (
        <>
          <TruepointHighlight
            selectedStream={selectedStream}
            highlightData={highlightData}
          />
          <MetricsAccordian
            selectedStream={selectedStream}
            highlightData={highlightData}
            categories={categoriesData}
          />
        </>
      )}
    </Paper>
  );
}
