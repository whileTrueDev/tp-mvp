import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TrendsBarChartProps } from '../types/ToptenCard.types';

function TrendsBarChart(props: TrendsBarChartProps): JSX.Element {
  const { data, currentScoreName } = props;
  const theme = useTheme();
  const chartRef = useRef<{
    chart: Highcharts.Chart,
    container: React.RefObject<HTMLDivElement>
  }>(null);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    credits: { enabled: false },
    title: { text: undefined },
    legend: { enabled: false },
    chart: {
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
      plotBackgroundColor: theme.palette.grey[300],
    },
    xAxis: {
      labels: { enabled: false },
      gridLineColor: 'transparent',

    },
    yAxis: {
      labels: { enabled: false },
      gridLineColor: 'transparent',
      min: 0,
      max: 10,
      title: { text: ' ' },
    },
  });

  useEffect(() => {
    if (!data) return;
    console.log(data, currentScoreName);
    const dates = data.map((d) => d.createDate);
    const scores = data.map((d) => d[currentScoreName] as number);
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
        { type: 'line', data: scores },
      ],
    });
  }, [data, currentScoreName, theme.palette.grey]);

  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      options={chartOptions}
      containerProps={{ style: { height: `${theme.spacing(12)}px`, width: '100%' } }}
    />
  );
}

export default TrendsBarChart;
