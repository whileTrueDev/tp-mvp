import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Typography, Divider } from '@material-ui/core';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

import { MonthlyScoresItem } from '../MonthlyScoresRankingCard';

interface ScoresBarChartProps{
  title?: string,
  data: MonthlyScoresItem[],
  loading?: boolean,
  column? : string,
  barColor? : string,
}

// https://github.com/highcharts/highcharts/issues/13738
interface PlottablePoint extends Highcharts.Point {
  plotX: number;
  plotY: number;
}

/**
 * 막대그래프 안에 1,2,3위 별 표시
 * @param renderer Highcharts.SVGRenderer
 * @param order 금=0, 은=1, 동=2
 * @param x 별이 표시될 x좌표
 * @param y 별이 표시될 y좌표
 */
function createStar(renderer: Highcharts.SVGRenderer, order: number, x: number, y: number) {
  // 별에 그라디언트 넣기 위한 색 설정
  const starColors = [
    { id: 'gold', startColor: '#f5f542', endColor: '#c9a234' }, // 금
    { id: 'silver', startColor: '#d2d6d5', endColor: '#7f9090' }, // 은
    { id: 'bronze', startColor: '#ff8800', endColor: '#9f5c02' }, // 동
  ];
  const { id: gradientId, startColor, endColor } = starColors[order];
  // 그라디언트 생성
  const gradient = renderer.createElement('linearGradient')
    .attr({
      id: gradientId, x1: '0%', y1: '0%', x2: '0%', y2: '100%',
    }).add(renderer.defs);
  renderer.createElement('stop')
    .attr({
      offset: '0%', style: `stop-color:${startColor}`,
    }).add(gradient);
  renderer.createElement('stop')
    .attr({
      offset: '100%', style: `stop-color:${endColor}`,
    }).add(gradient);

  // 별모양 생성
  const star = renderer.createElement('polygon');
  star.attr({
    points: '20,5 25,20 40,20 30,30 35,45 20,35 5,45 10,30 0,20 15,20', // 별의 각 모서리 좌표 x,y
    fill: `url(#${gradientId})`,
    zIndex: 5,
    transform: `translate(${x},${y}) scale(0.4)`,
  }).add();
}

function ScoresBarChart({
  title, data, loading, column, barColor,
}: ScoresBarChartProps): JSX.Element {
  const theme = useTheme();
  const chartRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
  }>(null);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
      spacingTop: 30,
      height: 250,
      events: {
        redraw(this: Highcharts.Chart) { // redraw이벤트 발생시 === 데이터가 들어왔을때
          const {
            series, renderer, plotHeight,
          } = this;
          if (!series[0] || series[0].data.length === 0) return;

          // 1,2,3위에 대해 금은동 별 표시
          for (let i = 0; i < 3; i += 1) {
            const point = series[0].data[i] as PlottablePoint;
            const x = point.plotX + 2; // 별이 표시될 x좌표
            const y = plotHeight; // 별이 표시될 y 좌표
            createStar(renderer, i, x, y);
          }
        },
      },
    },
    title: { text: undefined },
    yAxis: {
      title: { text: undefined },
      labels: { enabled: false },
      max: 10,
      tickInterval: 1,
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
        borderRadius: 12,
        color: barColor,
        pointWidth: 30,
      },
    },
    legend: { enabled: false },
    series: [],
    xAxis: {
      labels: {
        style: {
          fontSize: '0.8rem',
          color: theme.palette.common.black,
        },
      },
    },
  });

  useEffect(() => {
    if (data.length === 0) return;
    const creatorNames = data.map((d) => d.creatorName);
    const scores = data.map((d) => d.avgScore);
    setChartOptions({
      xAxis: { categories: creatorNames },
      series: [{ type: 'column', name: `평균 ${column} 점수`, data: scores }],
    });
  }, [column, data]);

  return (
    <section>
      <Typography variant="h6">{title}</Typography>
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

export default ScoresBarChart;
