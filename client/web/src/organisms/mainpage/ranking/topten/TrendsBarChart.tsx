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
    case 'rating':
      return '일일 평균 평점';
    default:
      return '점수';
  }
}

function getMinMax(currentScoreName: keyof Scores): {min: number|undefined, max: number|undefined} {
  switch (currentScoreName) {
    case 'viewer':
      return { min: undefined, max: undefined };
    case 'rating':
      return { min: 0, max: 10 };
    default:
      return { min: 3, max: 10 };
  }
}
export interface CustomPointOption extends Highcharts.PointOptionsObject {
  y: number;
  originValue: number;
  title?: string;
}

function tooltipFormatter(this: Highcharts.TooltipFormatterContextObject) {
  const {
    y, series, key, point,
  } = this;
  const { options } = point;
  const customOption = options as CustomPointOption;
  const {
    title,
  } = customOption;

  let value: string;
  switch (series.name) {
    case '시청자 수':
      value = `${Highcharts.numberFormat(y as number, 0, undefined, ',')} 명`;
      break;

    default:
      value = `${Highcharts.numberFormat(y as number, 2, undefined, ',')} 점`;
      break;
  }

  return `
  <div>
    <span>${key}</span><br/>
    ${title ? `<span style="font-weight: bold">${title}</span><br/>` : ''}
    <br/>
    <span style=" margin-right: 20px;">${series.name}</span>
    <span style="font-weight: bold">${value}</span>
  </div>
  `;
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
  const TrendsBarChartStyle = useRef<{height: string, width: string}>({
    height: `${theme.spacing(9.5)}px`,
    width: '100%',
  });

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
      title: { text: ' ' },

    },
    tooltip: {
      headerFormat: `<span style="font-size: ${theme.typography.body2.fontSize}">{point.key}</span><br/>`,
      style: {
        fontSize: `${theme.typography.body2.fontSize}`,
      },
      useHTML: true,
      formatter: tooltipFormatter,
      outside: true,
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

    // 감정점수 데이터일 경우 3점 이하는 3점 위치에 고정
    // 10점 이상인경우 10점에 고정
    const tempData = source.map((d) => {
      const originValue = d[currentScoreName] as number;
      let y: number;
      if (currentScoreName.includes('Score') && originValue && originValue < 3) {
        y = 3;
      } else if (currentScoreName.includes('Score') && originValue && originValue > 10) {
        y = 10;
      } else {
        y = originValue;
      }
      return {
        y,
        originValue,
        title: d.title,
      };
    });

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
        minPadding: 0.2,
      },
      yAxis: {
        min: getMinMax(currentScoreName).min,
        max: getMinMax(currentScoreName).max,
        minPadding: 0.2,
      },
      series: [
        {
          type: 'line',
          data: tempData,
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
