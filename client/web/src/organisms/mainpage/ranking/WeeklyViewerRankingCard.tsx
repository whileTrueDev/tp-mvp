import React, {
  useEffect, useState, useRef,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as datefns from 'date-fns';

import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';
import getPlatformColor from '../../../utils/getPlatformColor';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

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
  totalViewer: string;
}

const markerSize = {
  width: 14,
  height: 14,
};

function WeeklyViewerRankingCard(): JSX.Element {
  const classes = useWeeklyViewerStyle();
  const { enqueueSnackbar } = useSnackbar();
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);
  // 주간 시청자수 데이터
  const [{ data, error, loading }] = useAxios<{afreeca: WeeklyData[], twitch: WeeklyData[]}>('/rankings/weekly-viewers');
  // 차트 옵션 state
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      spacingTop: 24,
      height: 250,
    },
    title: { text: undefined },
    xAxis: { crosshair: true },
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
    tooltip: {
      shared: true,
      useHTML: true,
      shape: 'callout',
      padding: 4,
      pointFormatter(this: Highcharts.Point) {
        const { y, series, color } = this;
        return `
        <div>
          <span style="color: ${color}; margin-right: 20px;">${series.name}</span> 
          <span>${Highcharts.numberFormat(y as number, 0, undefined, ',')} 명</span>
        </div>
        `;
      },
    },
  });

  // data변경시 (데이터를 불러왔을 때) 실행 -> 그래프 series옵션 변경하여 그래프 그림
  useEffect(() => {
    if (!data) return;
    const dates = data.afreeca.map((d: WeeklyData) => datefns.format(new Date(d.date), 'MM-dd'));

    const afreecaViewerData = data.afreeca.map((d: WeeklyData) => +d.totalViewer);
    const twitchViewerData = data.twitch.map((d: WeeklyData) => +d.totalViewer);

    setChartOptions({
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
      xAxis: { categories: dates },
    });
  }, [data]);

  // 에러핸들러
  if (error) {
    ShowSnack('주간 시청자수 데이터를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
  }

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
