import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, List, ListItem, Hidden, Button
} from '@material-ui/core';
// sub components
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import StreamCalendar from './Calendar';
import StreamCard from './StreamCard';
import StreamList from './StreamList';
import useStreamHeroStyles from './StreamsAnalysisHero.style';

export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

export default function StreamsAnalysisHero(): JSX.Element {
  const classes = useStreamHeroStyles();
  const [dayStreamsList, setDayStreamsList] = React.useState<DayStreamsInfo[]>([]);
  const [clickedDate, setClickedDate] = React.useState<Date>(new Date());
  const [baseStream, setBaseStream] = React.useState<DayStreamsInfo|null>(null);
  const [compareStream, setCompareStream] = React.useState<DayStreamsInfo|null>(null);

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

  const handleAnalysisButton = () => {
    console.log(baseStream, compareStream);
  };

  return (
    <div className={classes.root}>
      <Divider style={{
        backgroundColor: '#4b5ac7', width: '200px', marginBottom: '12px', height: '3px'
      }}
      />
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
        <Grid item style={{ marginBottom: '5px' }}>
          <Paper
            className={classes.bodyPapper}
          >

            <Typography
              className={classes.subTitle}
            >
              <VideocamOutlinedIcon style={{ fontSize: '32.5px', marginRight: '26px' }} />
              날짜 선택
            </Typography>
          </Paper>

        </Grid>
        <Grid item container direction="row" xs={12}>
          <Grid className={classes.bodyWrapper} container xs={8} item>
            {/* 캘린더 + 방송 선택 가능 리스트 + 해당 방송 카드 2개 */}
            <Grid item xs style={{ width: '310px' }}>
              <Typography
                className={classes.bodyTitle}
              >
                <VideocamOutlinedIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                날짜 선택
              </Typography>
              <StreamCalendar
                handleDayStreamList={handleDayStreamList}
                clickedDate={clickedDate}
                setClickedDate={setClickedDate}
              />
            </Grid>
            <Grid item xs>
              <Typography
                className={classes.bodyTitle}
              >
                <VideocamOutlinedIcon style={{ fontSize: '28.5px', marginRight: '26px' }} />
                방송 선택
              </Typography>
              <StreamList
                dayStreamsList={dayStreamsList}
                baseStream={baseStream}
                compareStream={compareStream}
                handleSeletedStreams={handleSeletedStreams}
              />
            </Grid>
          </Grid>

          <Grid item xs container direction="column">

            <Grid item style={{ marginBottom: '22px' }}>
              {baseStream && (
              <StreamCard
                stream={baseStream}
                handleSeletedStreams={handleSeletedStreams}
                base
              />
              )}

            </Grid>

            <Grid item style={{ marginBottom: '22px' }}>
              {compareStream && (
              <StreamCard
                stream={compareStream}
                handleSeletedStreams={handleSeletedStreams}
              />
              )}
            </Grid>
          </Grid>
        </Grid>

      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '15px', fontWeight: 'bold' }}
        size="large"
        disabled={!(baseStream && compareStream)}
        onClick={handleAnalysisButton}
      >
        분석하기
      </Button>
    </div>
  );
}
