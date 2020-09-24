import React from 'react';
import classnames from 'classnames';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent,
  Avatar, Grid, Typography, Grow, Checkbox, Button
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { UserMetrics } from '../../../interfaces/UserMetrics';
import UserMetricsChart from './sub/UserMetricsChart';
import ProgressBar from '../../../atoms/Progressbar/ProgressBar';
import RedProgressBar from '../../../atoms/Progressbar/RedProgressBar';
import TruepointRating from '../../../atoms/Rating/TruepointRating';
import getPlatformColor from '../../../utils/getPlatformColor';

const useStyles = makeStyles((theme) => ({
  card: {
    cursor: 'pointer',
    transition: '0.1s linear all',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[10],
    }
  },
  selected: { transition: '0.1s linear all' }
}));

export default function UserMetricsSection(): JSX.Element {
  const PLATFORM_LIST = ['afreeca', 'twitch', 'youtube'];
  const classes = useStyles();

  // **************************************************
  // Data fetching from backend
  const [{ loading, data }] = useAxios<UserMetrics[]>({
    url: 'stream-analysis/user-statistics',
    method: 'GET',
    params: { userId: 'userId1' }
  });

  // **************************************************
  // 데이터 생성
  function makeData(d: UserMetrics[]): {name:string, value:number, nameKr: string}[] {
    const result:any[] = [];

    if (d.length > 0) {
      const sortedData = d.sort((
        a, b
      ) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
      const fanDelta = sortedData[sortedData.length - 1].fan - sortedData[0].fan;

      let count = 0;
      const reduced:any = sortedData.reduce((prev, current) => {
        count += 1;
        const prev1 = prev;
        prev1['평균 방송시간'] += current.airTime;
        prev1['평균 시청자'] += current.viewer;
        prev1['평균 채팅 발생수'] += current.chatCount;
        return prev1;
      }, { '평균 방송시간': 0, '평균 시청자': 0, '평균 채팅 발생수': 0 });

      result.push({ name: 'viewer', nameKr: '평균 시청자', value: Math.round(reduced['평균 시청자'] / count) });
      result.push({ name: 'airTime', nameKr: '평균 방송시간', value: Math.round(reduced['평균 방송시간'] / count) });
      result.push({ name: 'chatCount', nameKr: '평균 채팅 발생수', value: Math.round(reduced['평균 채팅 발생수'] / count) });
      result.push({ name: 'fan', nameKr: '애청자 변화량', value: fanDelta });
      return result;
    }
    return [];
  }

  // **************************************************
  // Selected Card
  const [selectedCard, setSelectedCard] = React.useState('viewer');
  function handleCardSelect(field: string) {
    setSelectedCard(field);
  }

  // **************************************************
  // Selected Platform
  const [selectedPlatform, setSelectedPlatform] = React.useState(PLATFORM_LIST);
  function handlePlatformSelect(platform: string) {
    setSelectedPlatform((prev) => {
      if (prev.includes(platform)) { // 이미 선택한 경우
        return prev.filter((x) => x !== platform);
      }
      return prev.concat(platform);
    });
  }

  return (
    <>
      <Grid container spacing={2} style={{ marginBottom: 32 }} alignItems="center">
        <Grid item xs={3} container direction="column" alignItems="center">
          <Avatar
            // src="https://avatars0.githubusercontent.com/u/42171155?s=400&u=72c333c5e2c44b64b16b7fef5670182c523d4c96&v=4"
            style={{ width: 150, height: 150, margin: '32px 32px 16px 32px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TruepointRating name="read-only" value={0.5} precision={0.5} />
            <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white' }}>0.5</Typography>
          </div>
          <div>
            {PLATFORM_LIST.map((platform) => (
              <Checkbox
                key={`${platform}select-button`}
                checked={selectedPlatform.includes(platform)}
                onChange={() => { handlePlatformSelect(platform); }}
                inputProps={{ 'aria-label': `chart-select-${platform}` }}
                style={{ color: getPlatformColor(platform) }}
              />
            ))}
          </div>
        </Grid>

        <Grid item xs={9} container direction="column" alignItems="center">
          {!loading && data && data.length > 0 && (
            <UserMetricsChart
              data={data}
              valueField={selectedCard}
              selectedPlatform={selectedPlatform}
            />
          )}
          {!loading && data && data.length === 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
            >
              <Typography variant="h6">그래프를 표현할 데이터가 없습니다.</Typography>
              <Typography variant="body1">(방송정보가 정상적으로 확인되지 않는 경우, 고객센터에 문의 주시기 바랍니다.)</Typography>
            </div>
          )}
          {false && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
            >
              <Typography variant="h6">채널 연동 및 구독 시,</Typography>
              <Typography variant="h6">트루포인트에서만 확인할 수 있는 다양한 통계를 제공받으실 수 있습니다.</Typography>
              <Button variant="contained" color="secondary" style={{ marginTop: 16 }}>채널연동 하러가기</Button>
            </div>
          )}
        </Grid>

        <Grid item xs={12} container spacing={2} style={{ marginTop: 32 }}>
          {!loading && (
          <>
            {makeData(data.filter((d) => selectedPlatform.includes(d.platform)))
              .map((card) => (
                <Grid item xs={3} key={card.name}>
                  <Card
                    className={classnames({
                      [classes.card]: selectedCard !== card.name,
                      [classes.selected]: selectedCard === card.name
                    })}
                    onClick={() => { handleCardSelect(card.name); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
                      <Typography variant="h6">{card.nameKr}</Typography>
                      {selectedCard === card.name && (
                      <Grow in><VisibilityIcon color="primary" /></Grow>
                      )}
                    </div>
                    <div style={{ padding: '0px 16px' }}>
                      {card.value >= 0 ? (
                        <ProgressBar variant="determinate" value={100} />
                      ) : (
                        <RedProgressBar variant="determinate" value={100} />
                      )}
                    </div>
                    <CardContent style={{ padding: '8px 16px', marginBottom: 32 }}>
                      <Typography variant="h5" style={{ fontWeight: 900, lineHeight: 1.43 }}>
                        {card.value.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </>
          )}
          {!loading && data.length > 0 && selectedPlatform.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 16,
            marginBottom: 16
          }}
          >
            <Typography variant="caption">* 통계 데이터는 최근 일주일간의 데이터를 기준으로 산정합니다.</Typography>
            <Typography variant="caption">* 그래프 데이터는 최근 일주일간 플랫폼별 방송 이력을 기준으로 작성됩니다.</Typography>
          </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}
