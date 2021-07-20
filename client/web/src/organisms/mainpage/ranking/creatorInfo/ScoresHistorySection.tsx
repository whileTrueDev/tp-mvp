import useAxios from 'axios-hooks';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { ScoreHistoryData } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import dayjs from 'dayjs';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { Icons } from '../ToptenCard';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

NoDataToDisplay(Highcharts);
Highcharts.setOptions({
  time: {
    timezoneOffset: -9 * 60, // 9시간 느리게 표시됨.. timezone 옵션 변경하려면 moment.js 설치필요, dayjs 사용하고 있는 상태에서 굳이 momentjs 설치할 필요가 없다고 생각해서 offset값 지정함
  },
});

function formatNumber(type: string, number: number): string {
  switch (type) {
    case '최고 시청자 수':
      return Highcharts.numberFormat(number, 0, undefined, ',');
    default:
      return Highcharts.numberFormat(number, 2, undefined, ',');
  }
}

function tooltipFormatter(this: Highcharts.TooltipFormatterContextObject) {
  const {
    x, y, series, point,
  } = this;
  const value = point.options ? point.options.custom?.originValue : y;
  const number = formatNumber(series.name, Number(value));
  return `
  <b>${dayjs(x).format('ll')}</b>
  <table>
  <tr>
    <td>${point.options.title || ''}</td>
  </tr>
  <tr>
    <td style="color: ${series.options.color}">${series.name}: </td>
    <td><b>${number}</b></td>
  </tr>
  </table>
`;
}

function dataLabelFormatter(this: Highcharts.PointLabelObject) {
  const number = Number(this.point.options?.custom?.originValue) || 0;
  return formatNumber(this.series.name, number);
}

type ScoresHistoryControlButton = {
  key: keyof ScoreHistoryData,
  label: string,
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
}
const buttons: ScoresHistoryControlButton[] = [
  { key: 'viewer' as const, label: '최고 시청자 수' },
  { key: 'rating' as const, label: '시청자 평점' },
  { key: 'admire' as const, label: '감탄점수' },
  { key: 'smile' as const, label: '웃음점수' },
  { key: 'frustrate' as const, label: '답답함점수' },
  { key: 'cuss' as const, label: '욕점수' },
].map((button) => ({ ...button, icon: Icons[button.key] }));

const ScoresHistorySectionHeight = 280;

export default function ScoresHistorySection({ creatorId }: {creatorId: string}): JSX.Element {
  const theme = useTheme();
  const { isMobile: isDownSm, isDownXs } = useMediaSize();
  const [{ data, loading }] = useAxios<ScoreHistoryData[]>({
    url: '/rankings/scores/history',
    method: 'get',
    params: {
      creatorId,
    },
  });

  const [selectedButton, setSelectedButton] = useState<ScoresHistoryControlButton>(buttons[0]);
  const [buttonState, setButtonState] = useState<keyof ScoreHistoryData>('viewer');

  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);

  useEffect(() => {
    if (chartRef.current) {
      const { chart } = chartRef.current;
      if (loading) {
        chart.showLoading();
      } else {
        chart.hideLoading();
      }
    }
  }, [loading]);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      height: ScoresHistorySectionHeight,
      spacing: [16, 16, 16, 16],
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      crosshair: true,
      labels: {
        format: '{value:%m-%d}',
      },
    },
    yAxis: {
      title: { text: undefined },
    },
    legend: { enabled: false },
    tooltip: {
      useHTML: true,
      formatter: tooltipFormatter,
    },
  });

  useEffect(() => {
    if (!data) return;

    // 데이터 중 값이 null이 아닌 첫번째 인덱스 찾기
    const firstNotNullItemIndex = data.findIndex((item) => item[buttonState]);
    const validData = data.slice(firstNotNullItemIndex);

    const tempData = validData.map((d) => {
      const originValue = d[buttonState];
      let y: number|null;
      let overMax = false;

      if (buttonState !== 'viewer' && originValue && originValue > 10) {
        y = 10;
        overMax = true;
      } else {
        y = originValue === null ? originValue : Number(originValue);
      }
      return {
        x: dayjs(d.date).valueOf(),
        y,
        title: d.title || undefined,
        marker: {
          enabled: overMax,
          symbol: 'circle',
          radius: 6,
          lineColor: 'white',
          lineWidth: 4,
        },
        dataLabels: {
          enabled: true,
          formatter: dataLabelFormatter,
        },
        custom: { overMax, originValue },
      };
    });

    const minDate = validData[0].date || undefined;
    const maxDate = validData[validData.length - 1].date || undefined;
    const xAxis = {
      min: dayjs(minDate).valueOf(),
      max: dayjs(maxDate).valueOf(),
    };
    const yAxis = {
      max: !['viewer'].includes(buttonState) ? 10 : null,
      min: 0,
    };

    setChartOptions({
      chart: {
        backgroundColor: theme.palette.background.paper,
      },
      lang: {
        noData: buttonState === 'rating' ? '매겨진 별점이 없습니다. 별점을 매겨보세요!' : '데이터가 없습니다',
      },
      noData: {
        position: {
          align: 'center',
          verticalAlign: 'middle',
        },
      },
      series: [
        {
          type: 'line',
          data: firstNotNullItemIndex === -1 ? [] : tempData,
          name: selectedButton.label,
        },
      ],
      xAxis,
      yAxis,
      plotOptions: {
        series: {
          connectNulls: true,
          color: theme.palette.primary.dark,
          marker: { enabled: false },
        },
      },
    });
  }, [buttonState, data, selectedButton.label, theme.palette.background.paper, theme.palette.primary.dark]);

  return (
    <Grid container style={{ backgroundColor: theme.palette.background.paper }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={2}
        container
        direction={isDownSm ? 'row' : 'column'}
        justify="space-around"
        wrap="nowrap"
        style={{ padding: 8 }}
      >
        {
          buttons.map((button) => (
            <Button
              key={button.key}
              onClick={() => {
                setButtonState(button.key);
                setSelectedButton(button);
              }}
              startIcon={isDownXs ? undefined : button.icon}
              variant="outlined"
              size={isDownSm ? 'small' : 'medium'}
              style={{
                backgroundColor: buttonState === button.key ? theme.palette.primary.main : 'transparent',
                color: buttonState === button.key ? theme.palette.primary.contrastText : theme.palette.text.primary,
                width: isDownXs ? 48 : 'auto',
              }}
            >
              {isDownXs ? button.icon : button.label}
            </Button>
          ))
        }
      </Grid>
      <Grid item xs={12} sm={12} md={10}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      </Grid>
    </Grid>
  );
}
