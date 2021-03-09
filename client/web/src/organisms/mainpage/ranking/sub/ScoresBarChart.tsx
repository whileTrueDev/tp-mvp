import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  useTheme, createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// eslint-disable-next-line camelcase
import HC_brokenAxis from 'highcharts/modules/broken-axis';

import { Typography, Divider } from '@material-ui/core';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

import { MonthlyScoresItem } from '../MonthlyScoresRankingCard';

HC_brokenAxis(Highcharts); // yAxis break 사용하기 위해 필요

interface ScoresBarChartProps{
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
 * 별 그리는 함수
 * @param renderer Highcharts.SVGRenderer
 * @param order 금=0, 은=1, 동=2
 * @param x 별이 표시될 x좌표
 * @param y 별이 표시될 y좌표
 */
function createStar(renderer: Highcharts.SVGRenderer, order: number, x: number, y: number) {
  // 별에 그라디언트 넣기 위한 색 설정
  const starColors = [
    { id: 'gold', startColor: '#ffff00', endColor: '#c9a589' }, // 금
    { id: 'silver', startColor: '#ebebeb', endColor: '#7f9090' }, // 은
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

/**
 * 차트 리드로우 이벤트 핸들러 -> 데이터가 들어와서 차트 다시 그려질 때, 데이터 값에 따라 금은동에 별 표시하는 함수
 * @param this Highcharts.Chart
 */
function markStarByDataOrder(this: Highcharts.Chart) {
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
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  barChartSection: {
    position: 'relative',
  },
  header: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
}));

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
      events: {
        redraw: markStarByDataOrder, // redraw이벤트 발생시 === 데이터가 들어왔을때 -> 데이터 값에 따라 금은동 표시
      },
    },
    title: { text: undefined },
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
    tooltip: {
      headerFormat: `<p style="font-size: ${creatorNameFontSize};">{point.key}</p><br/>`,
    },
  });

  useEffect(() => {
    if (data.length === 0) return;
    const creatorNames = data.map((d) => d.creatorName);
    const scores = data.map((d) => d.avgScore);
    const minInt = Math.floor(scores[scores.length - 1]); // 내림차순 5개 들어오는 값 중 마지막 == 최소값
    setChartOptions({
      xAxis: {
        categories: creatorNames,
        labels: {
          style: {
            fontSize: creatorNameFontSize,
            color: theme.palette.common.black,
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
  }, [column, data, theme.palette.common.black]);

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
