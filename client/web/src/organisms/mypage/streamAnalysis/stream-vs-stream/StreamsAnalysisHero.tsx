import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, List, ListItem
} from '@material-ui/core';
// sub components
// axios
import useAxios from 'axios-hooks';
import StreamCalendar from './Calendar';
import StreamCard from './StreamCard';

export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

export default function StreamsAnalysisHero(): JSX.Element {
  const [dayStreamsList, setDayStreamsList] = React.useState<DayStreamsInfo[]>([]);
  const [{
    data: getStreams,
    loading: getStreamsLoading,
    error: getStreamsError
  },
  excuteGetStreams] = useAxios({
    url: 'http://localhost:3000/stream-analysis/stream-list',
  }, { manual: true });

  const handleDayStreamList = (responseList: DayStreamsInfo[]) => {
    setDayStreamsList(responseList);
  };

  const handleChangeDayStreamList = (selectedDate: Date) => {
    excuteGetStreams({
      params: {
        userId: 'userId1',
        searchMonth: selectedDate.toISOString(),
      }
    }).then((resultList) => {
      handleDayStreamList(resultList.data);
    });
  };

  return (
    <div>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h5">
            방송별 리스트
          </Typography>
          <Typography>
            두 방송을 선택하시면 방송 비교 분석을 시작합니다.
          </Typography>
          <Divider />
        </Grid>
        <Grid item>
          날짜 선택
          <Divider />
        </Grid>
        <Grid item container direction="row" xs={12}>
          {/* 캘린더 + 방송 선택 가능 리스트 + 해당 방송 카드 2개 */}
          <Grid item xs={4}>
            <Typography variant="h5">
              이모티콘 + 날짜선택
            </Typography>
            <StreamCalendar
              dayStreamsList={dayStreamsList}
              handleDayStreamList={handleDayStreamList}
              handleChangeDayStreamList={handleChangeDayStreamList}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">
              이모티콘 + 방송 선택
            </Typography>
            <List>
              {dayStreamsList.map((stream) => (
                <ListItem key={stream.streamId}>
                  <Typography>
                    {stream.startedAt}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item container direction="column" xs={4}>
            선택한 방송 정보 2개
            <Grid item style={{marginBottom: "22px"}}>
              <StreamCard 
                title="세상 테스트"
                startedAt={new Date("2020-09-20T13:33:33")}
                airTime={3}
                base
              />
            </Grid>
            <Grid item>
              <StreamCard 
                title="세상 테스트"
                startedAt={new Date("2020-09-20T13:33:33")}
                airTime={3}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
