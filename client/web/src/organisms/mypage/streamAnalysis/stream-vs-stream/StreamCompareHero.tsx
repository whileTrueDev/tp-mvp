import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// custom svg icon
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import SelectVideoIcon from '../../../../atoms/stream-analysis-icons/SelectVideoIcon';
import YoutubeIcon from '../../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../../atoms/stream-analysis-icons/AfreecaIcon';
// sub components
import StreamCalendar from './Calendar';
import StreamCard from './StreamCard';
import StreamList from './StreamList';
// style
import useStreamHeroStyles from './StreamCompareHero.style';
// interface
import { DayStreamsInfo } from './StreamCompareHero.interface';

export default function StreamCompareHero(): JSX.Element {
  const classes = useStreamHeroStyles();
  const [dayStreamsList, setDayStreamsList] = React.useState<DayStreamsInfo[]>([]);
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const [baseStream, setBaseStream] = React.useState<DayStreamsInfo|null>(null);
  const [compareStream, setCompareStream] = React.useState<DayStreamsInfo|null>(null);
  const [fullMessageOpen, setFullMessageOpen] = React.useState<boolean>(false);

  const handleDayStreamList = (responseList:(DayStreamsInfo)[]) => {
    setDayStreamsList(responseList);
  };

  const handleSeletedStreams = (newStreams: DayStreamsInfo|null, base?: true) => {
    if (base) {
      setBaseStream(newStreams);
    } else {
      setCompareStream(newStreams);
    }
  };

  const handleFullMessage = (isSelectedListFull: boolean) => {
    setFullMessageOpen(isSelectedListFull);
  };

  const handleAnalysisButton = () => {
    // base, compare 존재시 활성화 , 하단 섹션으로 선택된 base, compare 방송 정보 전달
    console.log(baseStream, compareStream);
  };

  React.useEffect(() => {
    if (!compareStream || !baseStream) handleFullMessage(false);
  }, [compareStream, baseStream]);

  const platformIcon = (stream: DayStreamsInfo): JSX.Element => {
    switch (stream.platform) {
      case 'afreeca':
        return (
          <AfreecaIcon style={{ marginRight: '10px' }} />
        );
      case 'twitch':
        return (
          <TwitchIcon style={{ marginRight: '10px' }} />
        );
      case 'youtube':
        return (
          <YoutubeIcon style={{ marginRight: '10px' }} />
        );
      default:
        return <div />;
    }
  };

  return (
    <div className={classes.root}>
      <Divider className={classes.titleDivider} />
      <Grid container direction="column">
        <Grid item>
          <Typography
            className={classes.mainTitle}
          >
            방송별 리스트
          </Typography>
          <Typography
            className={classes.mainBody}
          >
            두 방송을 선택하시면 방송 비교 분석을 시작합니다.
          </Typography>
        </Grid>
        <Grid item container style={{ marginBottom: '5px' }} direction="row" alignItems="flex-end">
          <Paper
            elevation={0}
            className={classes.bodyPapper}
          >
            <Typography
              className={classes.subTitle}
            >
              <SelectDateIcon style={{ fontSize: '32.5px', marginRight: '26px' }} />
              날짜 선택
            </Typography>
          </Paper>
          <Collapse
            in={fullMessageOpen}
            style={{ height: 'auto', marginLeft: '20px' }}
          >
            <Alert severity="error" className={classes.alert}>
              x 표시를 눌러 삭제후 추가해주세요
            </Alert>
          </Collapse>
        </Grid>
        <Grid item container direction="row" xs={12}>
          <Grid className={classes.bodyWrapper} container xs={8} item>
            <Grid item xs style={{ width: '310px', }}>
              <Typography
                className={classes.bodyTitle}
              >
                <SelectDateIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                날짜 선택
              </Typography>
              {/* Custom Date Picker 달력 컴포넌트 */}

              <StreamCalendar
                handleDayStreamList={handleDayStreamList}
                clickedDate={clickedDate}
                setClickedDate={setClickedDate}
                baseStream={baseStream}
                compareStream={compareStream}
              />

            </Grid>
            <Grid item xs>
              <Typography
                className={classes.bodyTitle}
              >
                <SelectVideoIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                방송 선택
              </Typography>
              {/* 달력 날짜 선택시 해당 날짜 방송 리스트 */}
              <StreamList
                dayStreamsList={dayStreamsList}
                baseStream={baseStream}
                compareStream={compareStream}
                handleSeletedStreams={handleSeletedStreams}
                handleFullMessage={handleFullMessage}
                platformIcon={platformIcon}
              />
            </Grid>
          </Grid>

          <Grid item xs container direction="column">
            {/* 리스트 클릭시 base , compare 방송 정보 카드 렌더링 */}
            <Grid item style={{ marginBottom: '27px' }}>
              {baseStream && (
              <StreamCard
                stream={baseStream}
                handleSeletedStreams={handleSeletedStreams}
                platformIcon={platformIcon}
                base
              />
              )}
            </Grid>

            <Grid item style={{ marginBottom: '0px' }}>
              {compareStream && (
              <StreamCard
                stream={compareStream}
                handleSeletedStreams={handleSeletedStreams}
                platformIcon={platformIcon}
              />
              )}
            </Grid>
          </Grid>
        </Grid>

      </Grid>
      <Grid container justify="flex-end">
        <Button
          variant="contained"
          className={classes.anlaysisButton}
          disabled={!(baseStream && compareStream)}
          onClick={handleAnalysisButton}
        >
          분석하기
        </Button>
      </Grid>

    </div>
  );
}
