import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Scores, WeeklyTrendsItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';

function getSeriesName(currentScoreName: keyof Scores) {
  switch (currentScoreName) {
    case 'admireScore':
      return '감탄 점수';
    case 'smileScore':
      return '웃음 점수';
    case 'cussScore':
      return '욕 점수';
    case 'frustrateScore':
      return '답답함 점수';
    case 'viewer':
      return '시청자 수';
    default:
      return '점수';
  }
}
export interface TrendsBarChartProps{
  data: WeeklyTrendsItem[],
  currentScoreName: keyof Scores
}

function TrendsBarChart(props: TrendsBarChartProps): JSX.Element {
  const { data, currentScoreName } = props;
  const theme = useTheme();
  const chartRef = useRef<{
    chart: Highcharts.Chart,
    container: React.RefObject<HTMLDivElement>
  }>(null);
  const TrendsBarChartStyle = useRef<{height: string, width: string}>({ height: `${theme.spacing(14)}px`, width: '100%' });

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    credits: { enabled: false },
    title: { text: undefined },
    legend: { enabled: false },
    chart: {
      marginLeft: 0,
      marginRight: 0,
      plotBackgroundColor: theme.palette.grey[300],
    },
    plotOptions: {
      series: {
        color: theme.palette.primary.main,
      },
    },
    xAxis: {
      labels: { enabled: false },
      gridLineColor: 'transparent',
    },
    yAxis: {
      labels: { enabled: false },
      gridLineColor: 'transparent',
      min: currentScoreName === 'viewer' ? undefined : 0,
      max: currentScoreName === 'viewer' ? undefined : 10,
      title: { text: ' ' },
    },
    tooltip: {
      headerFormat: `<span style="font-size: ${theme.typography.body2.fontSize}">{point.key}</span><br/>`,
      style: {
        fontSize: `${theme.typography.body2.fontSize}`,
      },
      useHTML: true,
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const { y, series, key } = this;
        const value = currentScoreName === 'viewer'
          ? `${Highcharts.numberFormat(y as number, 0, undefined, ',')} 명`
          : `${Highcharts.numberFormat(y as number, 2, undefined, ',')} 점`;
        return `
        <div>
          <span style=" margin-right: 20px;">${key}</span><br/>
          <span style=" margin-right: 20px;">${series.name}</span><br/>
          <span style="font-weight: bold">${value}</span>
        </div>
        `;
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    const dates = data.map((d) => d.createDate);
    setChartOptions({
      xAxis: {
        categories: dates,
        plotLines: dates.map((value: string, index: number) => ({
          color: theme.palette.background.paper,
          width: 2,
          value: index - 0.5,
        })),
      },
      series: [
        {
          type: 'line',
          data: data.map((d) => d[currentScoreName] as number),
          name: getSeriesName(currentScoreName),
        },
      ],
    });
  }, [data, currentScoreName, theme.palette.grey, theme.palette.background.paper]);

  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      options={chartOptions}
      containerProps={{ style: TrendsBarChartStyle.current }}
    />
  );
}

export default TrendsBarChart;
