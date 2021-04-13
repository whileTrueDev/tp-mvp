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
    chart: {
      margin: 0,
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        color: theme.palette.primary.dark,
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
    let source: WeeklyTrendsItem[] = [];
    // 데이터가 7개 이하인 경우 빈칸 null로 채움
    if (data.length < 7) {
      const gap = 7 - data.length;
      source = [...data, ...Array(gap).fill({ createDate: null, [currentScoreName]: null })];
    } else {
      source = [...data];
    }

    const dates = source.map((d) => d.createDate);
    setChartOptions({
      chart: {
        margin: 0,
        plotBackgroundColor: theme.palette.action.disabledBackground,
        backgroundColor: theme.palette.background.paper,
      },
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
          data: source.map((d) => d[currentScoreName] as number),
          name: getSeriesName(currentScoreName),
        },
      ],
    });
  }, [data, currentScoreName, theme.palette.background.paper, theme.palette.action.disabledBackground]);

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
