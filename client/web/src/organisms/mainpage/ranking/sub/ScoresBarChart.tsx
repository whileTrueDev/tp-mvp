import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCBrokenAxis from 'highcharts/modules/broken-axis';

import { Typography, Divider } from '@material-ui/core';

import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { ScoresBarChartProps } from '../types/ScoresBarChart.types'; // yAxis break 사용하기 위해 필요
import { useStyles } from '../style/ScoresBarChart.style';
import '@fortawesome/fontawesome-free/css/all.css';

HCBrokenAxis(Highcharts);

function ScoresBarChart({
  data, loading, column, barColor,
}: ScoresBarChartProps): JSX.Element {
  const theme = useTheme();
  const classes = useStyles();
  const chartRef = useRef<{
    chart: Highcharts.Chart,
    container: React.RefObject<HTMLDivElement>
  }>(null);
  const title = useMemo(() => (`지난 월간 ${column} 점수 순위`), [column]);
  const creatorNameFontSize = useMemo(() => (`${theme.typography.body2.fontSize}`), [theme.typography.body2.fontSize]);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
      spacingTop: 30,
      height: 250,
    },
    credits: { enabled: false },
    title: { text: undefined },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: `${theme.typography.body2.fontSize}`,
          },
        },
        borderRadius: 12,
        color: barColor,
        pointWidth: 30,
      },
    },
    legend: { enabled: false },
    tooltip: {
      headerFormat: `<p style="font-size: ${creatorNameFontSize};">{point.key}</p><br/>`,
      style: {
        fontSize: `${theme.typography.body2.fontSize}`,
      },
    },
  });

  useEffect(() => {
    if (data.length === 0 || !chartRef.current) return;
    const creatorNames = data.map((d) => d.creatorName);
    const scores = data.map((d) => d.avgScore);
    const minInt = Math.floor(scores[scores.length - 1]); // 내림차순 5개 들어오는 값 중 마지막 == 최소값
    setChartOptions({
      xAxis: {
        categories: creatorNames,
        labels: {
          useHTML: true,
          style: {
            fontSize: creatorNameFontSize,
            color: theme.palette.common.black,
          },
          formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>) {
            // 1,2,3위 에 별모양 폰트아이콘 붙임
            const { pos, value } = this;
            return pos < 3
              ? `${value}<i class="fas fa-star star-${pos + 1}"></i>`
              : `${value}`;
          },
        },
      },
      yAxis: {
        breaks: [{
          from: 0,
          to: minInt,
          breakSize: 0.3,
        }],
        title: { text: undefined },
        tickInterval: 0.1,
        labels: { enabled: false },
      },
      series: [{ type: 'column', name: `평균 ${column} 점수`, data: scores }],
    });
  }, [column, creatorNameFontSize, data, theme.palette.common.black]);

  return (
    <section className={classes.barChartSection}>
      <header className={classes.header}>
        <Typography variant="h6" className={classes.title}>{title}</Typography>
        <Divider />
      </header>

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

export default ScoresBarChart;
