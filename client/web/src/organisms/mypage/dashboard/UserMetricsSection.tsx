import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Card, CardContent,
  Typography, Button, Paper, IconButton,
} from '@material-ui/core';
// 변화량 지표 생성시 주석 제거 필요 @dan 21.01.07 
// import {
//   ArrowDownward, ArrowUpward,
// } from '@material-ui/icons';
import { UserMetrics } from '../../../interfaces/UserMetrics';
import ProgressBar from '../../../atoms/Progressbar/ProgressBar';
import RedProgressBar from '../../../atoms/Progressbar/RedProgressBar';
import UserMetricsChart from './sub/UserMetricsChart';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import usePublicMainUser from '../../../store/usePublicMainUser';
import { useUserMetricsQuery } from '../../../utils/hooks/query/useUserMetricsQuery';

const useStyles = makeStyles((theme) => ({
  chartContainer: { padding: theme.spacing(4), height: 575, overflow: 'hidden' },
  columnFlexBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  cardBase: { minHeight: 135 },
  card: {
    cursor: 'pointer',
    transition: theme.transitions.create(['transform', 'boxShadow'], {
      duration: theme.transitions.duration.standard,
    }),
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
  filter: { textAlign: 'center' },
  platformIconButton: {
    '&:hover': { transform: 'scale(1.2)' },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.standard,
    }),
  },
}));

export interface DataCard {
  name: string; value: number; nameKr: string; delta?: number;
}

export default function UserMetricsSection(): JSX.Element {
  const auth = useAuthContext();
  const { user } = usePublicMainUser((state) => state);
  const PLATFORM_LIST = ['afreeca', 'twitch', 'youtube'];
  const classes = useStyles();

  // **************************************************
  // Data fetching from backend
  const { data, isFetching: loading } = useUserMetricsQuery(user.userId || auth.user.userId);

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
      ) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      // const fanDelta = sortedData[sortedData.length - 1].fan - sortedData[0].fan;

      let count = 0;
      const reduced: any = sortedData.reduce((prev, current) => {
        count += 1;
        const prev1 = prev;
        prev1['평균 방송시간'] += current.airTime;
        prev1['평균 시청자'] += current.viewer;
        prev1['평균 채팅 발생수'] += current.chatCount;
        prev1['총 애청자 수'] += current.fan;
        return prev1;
      }, {
        '평균 방송시간': 0, '평균 시청자': 0, '평균 채팅 발생수': 0, '총 애청자 수': 0,
      });

      result.push({ name: 'viewer', nameKr: '평균 시청자', value: Math.round(reduced['평균 시청자'] / count) });
      result.push({ name: 'airTime', nameKr: '평균 방송시간', value: Math.round(reduced['평균 방송시간'] / count) });
      result.push({ name: 'chatCount', nameKr: '평균 채팅 발생수', value: Math.round(reduced['평균 채팅 발생수'] / count) });
      // 가장 최근 방송의 애청자수로 수정 @joni 21.05.10
      result.push({
        name: 'fan', nameKr: '총 애청자 수', value: sortedData[sortedData.length - 1].fan,
      });
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
          {!loading && data && (
          <div className={classes.filter}>
            {data.length > 0 && (<Typography>방송사별 필터링</Typography>)}
            {Array
              .from(new Set(data.map((d) => d.platform)))
              .map((platform) => (
                <IconButton
                  key={platform}
                  className={classes.platformIconButton}
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
          )}
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
                  [classes.cardBase]: true,
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
                  {/* 변화량 지표 생성시 주석 제거 필요 @dan 21.01.07 */}
                  {/* {card.delta ? (
                    <div>
                      {card.delta >= 0 ? (
                        <ProgressBar variant="determinate" value={100} />
                      ) : (
                        <RedProgressBar variant="determinate" value={100} />
                      )}
                    </div>
                  ) : (
                    <div>
                      {card.value >= 0 ? (
                        <ProgressBar variant="determinate" value={100} />
                      ) : (
                        <RedProgressBar variant="determinate" value={100} />
                      )}
                    </div>
                  )} */}
                </div>
                <CardContent className={classes.cardBody}>
                  <Typography variant="h5" className={classes.cardContentString}>
                    {card.value.toLocaleString()}

                    {/* 변화량 지표 생성시 주석 제거 필요 @dan 21.01.07 */}
                    {/* {card.delta && (
                      <Typography component="span" variant="body1" gutterBottom>
                        {`(${card.delta}`}
                        &nbsp;
                        {card.delta > 0 ? (
                        // 변화량이 양수인 경우
                          <ArrowUpward fontSize="small" color="primary" />
                        ) : (
                        // 변화량이 음수인 경우
                          <ArrowDownward fontSize="small" color="error" />
                        )}
                        )
                      </Typography>
                    )} */}
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
