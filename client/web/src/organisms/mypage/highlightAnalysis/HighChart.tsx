import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useTheme from '@material-ui/core/styles/useTheme';

type MetricsType = 'chat'|'smile'|'funny'|'agree'|'surprise'|'disgust'|'highlight'|'question'

interface DataType {
  start_date: string;
  end_date: string;
  start_index: number;
  end_index: number;
  score: number
}

interface PointType extends Highcharts.Point {
  start_index: number;
  end_index: number
}

interface ChartProps {
  data: DataType[];
  chartType: MetricsType;
  highlight?: any;
  handleClick: (a: any) => void;
  handlePage: any;
  dateRange: any;
  pageSize: number;
}

export default function Chart({
  data,
  dateRange,
  chartType,
  highlight,
  handleClick,
  handlePage,
  pageSize,
}: ChartProps): JSX.Element {
  const theme = useTheme();

  const highchartsRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
  }>(null);

  // 컬럼값 바꾸지 않고 맵핑할 것
  const dataScore = data.map((row: DataType) => ({
    start_date: row.start_date,
    y: row.score,
    start_index: row.start_index,
    end_index: row.end_index,
  }));

  // testCode
  // const sDate = new Date(dateRange.startDate).getTime();
  // const eDate = new Date(dateRange.endDate).getTime();
  // const between = (eDate - sDate) / 10;

  // console.log(sDate, 'start');
  // console.log(eDate, 'end');
  // console.log(between, 'between');

  if (highlight.start_index) {
    const chartDataRef = highchartsRef.current?.chart.series[0].data[highlight.index];
    if (chartDataRef) {
      if (chartDataRef.selected) {
        chartDataRef.select();
      }
      chartDataRef.select();
    }
  }

  const chartOptions = {
    chart: {
      renderTo: 'container',
      type: 'area',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      crosshair: true,
      type: 'datetime',
      // labels: {
      //   format: '{value:%H시%m분%S초}',
      //   align: 'center',
      // },
    },
    yAxis: {
      title: {
        text: '',
      },
      allowDecimals: false,
      type: 'linear',
      plotLines: [{
        value: 40,
        width: 2,
        color: theme.palette.primary.main,
        dashStyle: 'dash',
      }],
    },
    series: [{
      data: dataScore,
      // pointStart: Date.UTC(2021, 0, 0),
      pointInterval: 638200 / 2,
      lineWidth: 4,
      lineColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      fillOpacity: 0.5,
      zones: [{
        color: theme.palette.grey[300],
        value: 40, // 임계점 테스트 진행 후 진행
      }, {
        color: theme.palette.primary.main,
      }],
    }],
    tooltip: {
      backgroundColor: '#ff3e7a',
      borderColor: '#ff3e7a',
      borderRadius: 5,
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const { y } = this;
        return `${y}`;
      },
      style: {
        color: theme.palette.common.white,
        fontSize: 15,
        fontWeight: theme.typography.fontWeightBold,
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: {
          lineWidth: 3,
          states: {
            select: {
              fillColor: '#ff3e7a',
              lineColor: '#ff3e7a',
              lineWidth: 6,
            },
          },
        },
        cursor: 'pointer',
        point: {
          events: {
            click(this: PointType, event: Highcharts.PointClickEventObject) {
              const {
                y, start_index, end_index, index,
              } = this;
              event.preventDefault();
              if (y as number > 40) {
                handleClick({
                  start_index,
                  end_index,
                  index,
                });
                handlePage(Math.floor(index / pageSize));
              }
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <HighchartsReact
        ref={highchartsRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
