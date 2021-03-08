import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as datefns from 'date-fns';

import getPlatformColor from '../../../utils/getPlatformColor';
import CenterLoading from '../../../atoms/Loading/CenterLoading';

const useWeeklyViewerStyle = makeStyles((theme: Theme) => createStyles({
  weeklyViewerContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  weeklyViewerTitle: {
    padding: theme.spacing(2),
  },
}));

interface WeeklyData{
  date: string;
  totalViewer: number;
}

// 임시데이터 - 백엔드와 연결이후 삭제예정
const dummyWeeklyData = {
  afreeca: [
    { date: '2021-3-5', totalViewer: 134321 },
    { date: '2021-3-4', totalViewer: 123411 },
    { date: '2021-3-3', totalViewer: 134531 },
    { date: '2021-3-2', totalViewer: 121351 },
    { date: '2021-3-1', totalViewer: 123451 },
    { date: '2021-2-28', totalViewer: 126421 },
    { date: '2021-2-27', totalViewer: 134561 },
  ].reverse(),
  twitch: [
    { date: '2021-3-5', totalViewer: 109382 },
    { date: '2021-3-4', totalViewer: 113452 },
    { date: '2021-3-3', totalViewer: 124532 },
    { date: '2021-3-2', totalViewer: 111352 },
    { date: '2021-3-1', totalViewer: 113452 },
    { date: '2021-2-28', totalViewer: 116422 },
    { date: '2021-2-27', totalViewer: 124562 },
  ].reverse(),
};

const markerSize = {
  width: 14,
  height: 14,
};

function WeeklyViewerRankingCard(): JSX.Element {
  const classes = useWeeklyViewerStyle();
  const chartRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
}>(null);

  const [data, setData] = useState<any>({ afreeca: [], twitch: [] });
  const [loading, setLoading] = useState<boolean>(true);
  // const [{loading}, getWeeklyData] = useAxios({ url: '/rankings/weekly-viewers' }, { manual: true });
  // 백엔드와 연결이후 바로 윗줄 코드와 교체예정

  const dates = useMemo(() => data.afreeca.map((d: WeeklyData) => datefns.format(new Date(d.date), 'MM-dd')), [data.afreeca]);
  const afreecaViewerData = useMemo(() => data.afreeca.map((d: WeeklyData) => d.totalViewer), [data.afreeca]);
  const twitchViewerData = useMemo(() => data.twitch.map((d: WeeklyData) => d.totalViewer), [data.twitch]);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      spacingTop: 24,
    },
    title: { text: undefined },
    xAxis: {
      categories: dates,
      crosshair: true,
    },
    yAxis: {
      title: { text: undefined },
      labels: { enabled: false },
    },
    legend: {
      align: 'left',
      layout: 'vertical',
      verticalAlign: 'bottom',
      itemMarginBottom: 30,
      labelFormat: ' ',
      margin: 0,
      symbolWidth: 40,
      symbolHeight: 20,
    },
    series: [
      {
        type: 'line',
        name: '아프리카',
        data: afreecaViewerData,
        color: getPlatformColor('afreeca'),
        marker: {
          symbol: 'url(/images/logo/afreecaLogo.png)',
          ...markerSize,
        },
      },
      {
        type: 'line',
        name: '트위치',
        data: twitchViewerData,
        color: getPlatformColor('twitch'),
        marker: {
          symbol: 'url(/images/logo/twitchLogo.png)',
          ...markerSize,
        },
      },
    ],
    tooltip: {
      split: true,
      useHTML: true,
      shape: 'callout',
      padding: 4,
      pointFormatter(this: Highcharts.Point) {
        const { y, series, color } = this;
        return `
        <div>
          <p style="color: ${color}">${series.name}</p> 
          <p>${Highcharts.numberFormat(y as number, 0, undefined, ',')} 명</p>
        </div>
        `;
      },
    },
  });

  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      setData(dummyWeeklyData);
      setLoading(false);
    }, 3000);

    return () => window.clearTimeout(timeoutID);

    // 백엔드 코드 수정후 합칠 예정
    // getWeeklyData().then((res) => {
    //   setWeeklyData(res.data);
    // }).catch((error) => {
    //   // 에러핸들링
    //   console.error(error);
    // });
  }, []);

  useEffect(() => {
    setChartOptions({
      series: [
        { type: 'line', data: afreecaViewerData },
        { type: 'line', data: twitchViewerData },
      ],
      xAxis: { categories: dates },
    });
  }, [afreecaViewerData, twitchViewerData, dates]);

  return (
    <section className={classes.weeklyViewerContainer}>
      <Typography variant="h6" className={classes.weeklyViewerTitle}>주간 시청자수 랭킹</Typography>
      <Divider />

      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
      {loading && (
      <CenterLoading />
      )}

    </section>
  );
}

export default WeeklyViewerRankingCard;
