import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useTheme from '@material-ui/core/styles/useTheme';
import DarkUnica from 'highcharts/themes/dark-unica';
import useTruepointThemeType from '../../../utils/hooks/useTruepointThemeType';
import THEME_TYPE from '../../../interfaces/ThemeType';

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
  handlePage: (page: number) => void;
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
  const { themeType } = useTruepointThemeType();
  const highchartsRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
  }>(null);
  const chartOptions = {
    chart: {
      renderTo: 'container',
      type: 'area',
      zoomType: 'x',
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
        align: 'center',
        formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>) {
          const { value } = this;
          const oneDayMillisec = 24 * 36e5;
          const duringDay = parseInt(`${value / oneDayMillisec}`, 10);
          const time = new Highcharts.Time({});
          const OriginH = Number(time.dateFormat('%H시%M분%S초', value).slice(0, 2));
          const originMtoS = time.dateFormat('%H시%M분%S초', value).slice(3);
          const returnDate = `${OriginH + (24 * duringDay)}시${originMtoS}`;
          return returnDate;
        },
      },
      // minRange: 3600000,
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
      lineWidth: 3,
      lineColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      fillOpacity: 0.5,
      zones: [{
        color: theme.palette.grey[300],
        value: dataOption.boundary,
      }, {
        color: theme.palette.primary.main,
      }],
    }],
    tooltip: {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      borderRadius: 5,
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const { y } = this;
        if (y as number >= dataOption.boundary) {
          return `트루포인트 SCORE:${y}`;
        }
        return false;
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
        turboThreshold: 50000, // 50000이상에서 터보모드 차트 써야함
        allowPointSelect: true,
        marker: {
          lineWidth: 3,
        },
        point: {
          events: {
            click(this: PointType, event: Highcharts.PointClickEventObject) {
              const {
                y, index, x,
              } = this;
              event.preventDefault();
              if (y as number >= dataOption.boundary) {
                for (let i = 0; i < data.length; i += 1) {
                  if (data[i].start_index <= index && data[i].end_index >= index) {
                    handleClick({
                      start_index: data[i].start_index,
                      end_index: data[i].end_index,
                      index: i,
                      x,
                    });
                    handlePage(Math.floor(i / pageSize));
                  }
                }
              }
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    if (themeType === THEME_TYPE.DARK) {
      DarkUnica(Highcharts);
    }

    Highcharts.setOptions({
      lang: {
        resetZoom: '초기화',
      },
    });

    if (highlight.start_index) {
      const chartxAxisRef = highchartsRef.current?.chart.xAxis[0];
      const chartDataRef = highchartsRef.current?.chart.series[0].data;
      // const zoomButton = highchartsRef.current?.chart;
      // console.log(zoomButton);

      if (chartxAxisRef && chartDataRef && chartDataRef[highlight.start_index].x) {
        chartxAxisRef.removePlotBand('plot-band');
        chartxAxisRef.addPlotBand({
          from: chartDataRef[highlight.start_index].x - 36000,
          to: chartDataRef[highlight.end_index].x + 36000,
          color: theme.palette.grey[200],
          id: 'plot-band',
          label: {
            text: '클릭한 편집점 구간',
            style: {
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '16px',
            },
          },
        });
      } else {
        // console.log('fuck');
      }
    }
  }, [highlight, themeType, theme.palette]);

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
