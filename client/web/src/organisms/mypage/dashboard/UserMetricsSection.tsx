import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Card, CardContent,
  Typography, Button, Paper, IconButton,
} from '@material-ui/core';
import { UserMetrics } from '../../../interfaces/UserMetrics';
import ProgressBar from '../../../atoms/Progressbar/ProgressBar';
import RedProgressBar from '../../../atoms/Progressbar/RedProgressBar';
import UserMetricsChart from './sub/UserMetricsChart';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  chartContainer: { padding: theme.spacing(4), height: 575, overflow: 'hidden' },
  columnFlexBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  cardBase: { minHeight: 120 },
  card: {
    cursor: 'pointer',
    transition: '0.1s linear all',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[10],
    },
  },
  cardHeader: { padding: `${theme.spacing(1)}px ${theme.spacing(2)}px` },
  cardDivider: { padding: `0px ${theme.spacing(2)}px` },
  cardBody: { padding: theme.spacing(2) },
  cardContentString: { fontWeight: 900, lineHeight: 1.43 },
  selected: {
    backgroundColor: theme.palette.action.selected,
    boxShadow: theme.shadows[0],
    transition: '0.1s linear all',
  },
  helper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export interface DataCard {
  name: string; value: number; nameKr: string;
}

export default function UserMetricsSection(): JSX.Element {
  const auth = useAuthContext();
  const PLATFORM_LIST = ['afreeca', 'twitch', 'youtube'];
  const classes = useStyles();

  // **************************************************
  // Data fetching from backend
  const [{ loading, data }, refetch] = useAxios<UserMetrics[]>({
    url: 'stream-analysis/user-statistics',
    method: 'GET',
    params: { userId: auth.user.userId },
  });
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  // **************************************************
  // 데이터 생성 함수
  function makeData(d: UserMetrics[]): DataCard[] {
    const result: any[] = [];

    if (d.length > 0) {
      const sortedData = d.sort((
        a, b,
      ) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
      const fanDelta = sortedData[sortedData.length - 1].fan - sortedData[0].fan;

      let count = 0;
      const reduced: any = sortedData.reduce((prev, current) => {
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
  // 데이터 스테이트
  const [preprocessedData, setPreprocessedData] = useState<DataCard[]>([]);
  useEffect(() => {
    if (!loading && data) {
      setPreprocessedData(makeData(data.filter((d) => selectedPlatform.includes(d.platform))));
    }
  }, [loading, data, selectedPlatform, setPreprocessedData]);

  // **************************************************
  // Selected Card
  const [selectedCard, setSelectedCard] = React.useState('viewer');
  function handleCardSelect(field: string) {
    setSelectedCard(field);
  }

  return (
    <Grid container>
      {/* 좌측 차트 컨테이너 */}
      <Grid item xs={9} container component={Paper} className={classes.chartContainer}>
        {/* 제목 및 플랫폼 선택 */}
        <Grid item xs={12} container justify="space-between">
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            {preprocessedData.find((d) => d.name === selectedCard)?.nameKr}
          </Typography>
          <div>
            {!loading && data && Array
              .from(new Set(data.map((d) => d.platform)))
              .map((platform) => (
                <IconButton
                  key={platform}
                  onClick={() => {
                    handlePlatformSelect(platform);
                  }}
                >
                  <img
                    width={30}
                    height={30}
                    src={`/images/logo/${platform}Logo.png`}
                    alt=""
                    style={{ filter: selectedPlatform.includes(platform) ? 'none' : 'grayscale(100%)' }}
                  />
                </IconButton>
              ))}
          </div>
        </Grid>
        {/* 차트 */}
        <Grid item xs={12}>
          {!loading && data && data.length > 0 && (
          <UserMetricsChart
            data={data.filter((d) => selectedPlatform.includes(d.platform))}
            valueField={selectedCard}
            selectedPlatform={selectedPlatform}
          />
          )}
          {/* 차트 데이터가 없는 경우 */}
          {!loading && data && data.length === 0 && (
            <div className={classes.columnFlexBox}>
              <Typography variant="h6">그래프를 표현할 데이터가 없습니다.</Typography>
              <Typography variant="body1">(방송정보가 정상적으로 확인되지 않는 경우, 고객센터에 문의 주시기 바랍니다.)</Typography>
            </div>
          )}
          {/* 연동한 채널이 없는 경우 */}
          {false && (
            <div className={classes.columnFlexBox}>
              <Typography variant="h6">채널 연동 및 구독 시,</Typography>
              <Typography variant="h6">트루포인트에서만 확인할 수 있는 다양한 통계를 제공받으실 수 있습니다.</Typography>
              <Button variant="contained" color="secondary" style={{ marginTop: 16 }}>채널연동 하러가기</Button>
            </div>
          )}
        </Grid>
        {/* 차트 도움말 */}
        {!loading && data && data.length > 0 && selectedPlatform.length > 0 && (
          <Grid item xs={12} container direction="column" className={classes.helper}>
            <Typography variant="caption">* 통계 데이터는 최근 10일간의 데이터를 기준으로 산정합니다.</Typography>
            <Typography variant="caption">* 그래프 데이터는 최근 10일간 플랫폼별 방송 이력을 기준으로 작성됩니다.</Typography>
          </Grid>
        )}
      </Grid>
      {/* 우측 지표 카드 */}
      <Grid item xs={3} container direction="column" justify="space-between" style={{ paddingLeft: 32 }}>
        {!loading && data && (
        <>
          {(preprocessedData.length <= 0) && [1, 2, 3, 4].map((dummy) => (
            <Card key={dummy} className={classes.cardBase} />
          ))}
          {preprocessedData.length > 0 && preprocessedData
            .map((card) => (
              <Card
                key={card.name}
                className={classnames({
                  [classes.card]: selectedCard !== card.name,
                  [classes.selected]: selectedCard === card.name,
                })}
                onClick={() => {
                  handleCardSelect(card.name);
                }}
              >
                <div className={classes.cardHeader}>
                  <Typography variant="h6">{card.nameKr}</Typography>
                </div>
                <div className={classes.cardDivider}>
                  {card.value >= 0 ? (
                    <ProgressBar variant="determinate" value={100} />
                  ) : (
                    <RedProgressBar variant="determinate" value={100} />
                  )}
                </div>
                <CardContent className={classes.cardBody}>
                  <Typography variant="h5" className={classes.cardContentString}>
                    {card.value.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </>
        )}
      </Grid>
    </Grid>
  );
}
