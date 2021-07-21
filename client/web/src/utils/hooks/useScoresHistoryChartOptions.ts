import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ScoreHistoryData } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { useScoresHistoryButton } from '../../store/scoresHistoryButton';

// 데이터 없을때 문구 표시하기 위한 모듈
NoDataToDisplay(Highcharts);

// x축 시간이 9시간 느리게 표시됨
// timezone 옵션 변경하려면 moment.js 설치필요
// dayjs 사용하고 있는 상태에서 굳이 momentjs 설치할 필요가 없다고 생각해서 offset값 지정
Highcharts.setOptions({
  time: {
    timezoneOffset: -9 * 60,
  },
});

export const highCharts = Highcharts;

// 숫자 형식 지정 함수 - 최고시청자수 이외에는 소수점 2자리까지 표시
function formatNumber(type: string, number: number): string {
  switch (type) {
    case '최고 시청자 수':
      return Highcharts.numberFormat(number, 0, undefined, ',');
    default:
      return Highcharts.numberFormat(number, 2, undefined, ',');
  }
}

// 툴팁 형식 지정 함수
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
      <td>
        <span style="color: ${series.options.color}">${series.name}: </span>
        <b>${number}</b>
      </td>
    </tr>
  </table>
`;
}

// 그래프에 뜨는 데이터 표시 함수
function dataLabelFormatter(this: Highcharts.PointLabelObject) {
  const number = Number(this.point.options?.custom?.originValue) || 0;
  return formatNumber(this.series.name, number);
}

// series.data에 넣을 데이터 생성 함수
// 감정점수 10점 이상 값인 경우 그래프에 표현되는 y값은 10점으로 넣고
// originValue를 따로 저장하여 툴팁과 라벨에는 원래값이 표시되도록 한다
// 10점 넘는 값에만 marker.enabled = true 설정함
// x : xAxis.type == 'datetime'이므로 milliseconds 형태로 넣는다
function makeSeriesData(
  data: ScoreHistoryData[],
  key: keyof ScoreHistoryData,
): (number | Highcharts.PointOptionsObject | [string | number, number | null] | null)[] | undefined {
  return data.map((d) => {
    const originValue = d[key];
    let y: number|null;
    let overMax = false;

    if (key !== 'viewer' && originValue && originValue > 10) {
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
}
// 그래프 섹션 높이
const ScoresHistorySectionHeight = 280;

export default function useScoresHistoryChartOptions({ creatorId }: {creatorId: string}): any {
  const theme = useTheme();
  const [{ data, loading }] = useAxios<ScoreHistoryData[]>({
    url: '/rankings/scores/history',
    method: 'get',
    params: {
      creatorId,
    },
  });

  const { selectedButton } = useScoresHistoryButton();

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      height: ScoresHistorySectionHeight,
      spacing: [16, 16, 16, 16],
    },
    title: { text: undefined },
    lang: { noData: undefined },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      crosshair: true,
      labels: {
        format: '{value:%m-%d}',
      },
    },
    yAxis: { title: { text: undefined } },
    legend: { enabled: false },
    tooltip: {
      useHTML: true,
      formatter: tooltipFormatter,
    },
  });

  useEffect(() => {
    if (!data) return;

    const { key, label } = selectedButton;

    // 데이터 중 값이 null이 아닌 첫번째 인덱스 찾기
    const firstNotNullItemIndex = data.findIndex((item) => item[key]);
    const validData = data.slice(firstNotNullItemIndex);

    const tempData = makeSeriesData(validData, key);

    const minDate = validData[0].date || undefined;
    const maxDate = validData[validData.length - 1].date || undefined;
    const xAxis = {
      min: dayjs(minDate).valueOf(),
      max: dayjs(maxDate).valueOf(),
    };
    const yAxis = {
      max: !['viewer'].includes(key) ? 10 : null,
      min: 0,
    };

    setChartOptions({
      chart: {
        backgroundColor: theme.palette.background.paper,
      },
      lang: {
        noData: key === 'rating' ? '매겨진 별점이 없습니다. 별점을 매겨보세요!' : '데이터가 없습니다',
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
          name: label,
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
  }, [data, selectedButton, theme.palette.background.paper, theme.palette.primary.dark]);

  return {
    chartOptions,
    loading,
  };
}
