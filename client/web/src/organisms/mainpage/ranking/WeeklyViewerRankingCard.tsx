import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as datefns from 'date-fns';
import { Divider, Typography } from '@material-ui/core';
import getPlatformColor from '../../../utils/getPlatformColor';

const useWeeklyViewerStyle = makeStyles((theme: Theme) => createStyles({
  weeklyViewerContainer: {
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

interface WeeklyViewerRankingCardProps {
  data: {
    afreeca: WeeklyData[],
    twitch: WeeklyData[]
  }
}

const markerSize = {
  width: 14,
  height: 14,
};

function WeeklyViewerRankingCard(props: WeeklyViewerRankingCardProps): JSX.Element {
  const classes = useWeeklyViewerStyle();
  const chartRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
}>(null);
  const { data } = props;
  const afreecaData = useMemo(() => data.afreeca.reverse(), [data]);
  const twitchData = useMemo(() => data.twitch.reverse(), [data]);
  const dates = useMemo(() => afreecaData.map((d: WeeklyData) => datefns.format(new Date(d.date), 'MM-dd')), [afreecaData]);
  const afreecaViewerArray = useMemo(() => afreecaData.map((d: WeeklyData) => d.totalViewer), [afreecaData]);
  const twitchViewerArray = useMemo(() => twitchData.map((d: WeeklyData) => d.totalViewer), [twitchData]);

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
        data: afreecaViewerArray,
        color: getPlatformColor('afreeca'),
        marker: {
          symbol: 'url(/images/logo/afreecaLogo.png)',
          ...markerSize,
        },
      },
      {
        type: 'line',
        name: '트위치',
        data: twitchViewerArray,
        color: getPlatformColor('twitch'),
        marker: {
          symbol: 'url(/images/logo/twitchLogo.png)',
          ...markerSize,
        },
      },
    ],
    tooltip: {
      formatter(this: Highcharts.TooltipFormatterContextObject, tooltip: Highcharts.Tooltip) {
        const { x, points } = this; // x: x축, points: 각 마커에 대응되는 정보

        // const pointsData = points
        //   ? points.map((point) => `${point.series.name}: ${point.y}m`)
        //   : [];

        return [`<b>${x}</b>`].concat(
          points
            ? points.map((point) => `${point.series.name}: ${point.y}m`) : [],
        );
      },
      shared: true,
    },
  });

  useEffect(() => {
    setChartOptions({
      series: [
        { type: 'line', data: afreecaViewerArray },
        { type: 'line', data: twitchViewerArray },
      ],
      xAxis: { categories: dates },
    });
  }, [afreecaViewerArray, dates, twitchViewerArray]);

  return (
    <section className={classes.weeklyViewerContainer}>
      <Typography variant="h6" className={classes.weeklyViewerTitle}>주간 시청자수 랭킹</Typography>
      <Divider />
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </section>
  );
}

export default WeeklyViewerRankingCard;
