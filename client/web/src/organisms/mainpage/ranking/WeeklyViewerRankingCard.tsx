import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as datefns from 'date-fns';
import { Divider, Typography } from '@material-ui/core';
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

interface WeeklyViewerRankingCardProps {
  data: {
    afreeca: WeeklyData[],
    twitch: WeeklyData[]
  },
  loading?: boolean
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
  const { data, loading } = props;
  const afreecaDataArray = useMemo(() => data.afreeca.reverse(), [data]);
  const twitchDataArray = useMemo(() => data.twitch.reverse(), [data]);
  const dates = useMemo(() => afreecaDataArray.map((d: WeeklyData) => datefns.format(new Date(d.date), 'MM-dd')), [afreecaDataArray]);
  const afreecaViewerData = useMemo(() => afreecaDataArray.map((d: WeeklyData) => d.totalViewer), [afreecaDataArray]);
  const twitchViewerData = useMemo(() => twitchDataArray.map((d: WeeklyData) => d.totalViewer), [twitchDataArray]);

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
    setChartOptions({
      series: [
        { type: 'line', data: afreecaViewerData },
        { type: 'line', data: twitchViewerData },
      ],
      xAxis: { categories: dates },
    });
  }, [afreecaViewerData, dates, twitchViewerData]);

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
