import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useTheme from '@material-ui/core/styles/useTheme';
// import DarkUnica from 'highcharts/themes/dark-unica';

// DarkUnica(Highcharts);

type MetricsType = 'chat'|'smile'|'funny'|'agree'|'surprise'|'disgust'|'highlight'|'question'

interface DataType {
  start_date: string;
  end_date: string;
  start_index: number;
  end_index: number;
  score: number
}

interface ToTalDataType {
  x: number;
  y: number
}

interface PointType extends Highcharts.Point {
  start_index: number;
  end_index: number
}

interface ChartProps {
  data: DataType[];
  dataOption: {boundary: number};
  totalData: ToTalDataType[];
  chartType: MetricsType;
  highlight?: any;
  handleClick: (a: any) => void;
  handlePage: any;
  pageSize: number;
}

export default function Chart({
  data,
  chartType,
  totalData,
  dataOption,
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
      labels: {
        format: '{value:%H:%M:%S}',
        align: 'center',
      },
    },
    yAxis: {
      title: {
        text: '',
      },
      allowDecimals: false,
      type: 'linear',
      plotLines: [{
        value: dataOption.boundary,
        width: 2,
        color: theme.palette.primary.main,
        dashStyle: 'dash',
      }],
    },
    series: [{
      data: totalData,
      lineWidth: 4,
      lineColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      fillOpacity: 0.5,
      zones: [{
        color: theme.palette.grey[300],
        value: dataOption.boundary, // 임계점 테스트 진행 후 진행
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
        return `트루포인트 SCORE:${y}`;
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
        turboThreshold: 50000,
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
              if (y as number > dataOption.boundary) {
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
