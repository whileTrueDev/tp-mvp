import React, {
  useEffect, useState, useRef,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useSnackbar } from 'notistack';
import getPlatformColor from '../../../utils/getPlatformColor';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import { useWeeklyLineCardStyle } from './style/WeeklyLineCard.style';
import CarouselItemHeader from './sub/CarouselItemHeader';
import { CAROUSEL_HEIGHT } from '../../../assets/constants';
import useWeeklyAverageRatingByPlatform from '../../../utils/hooks/query/useWeeklyAverageRatingsByPlatform';

function WeeklyLineCard(): JSX.Element {
  const classes = useWeeklyLineCardStyle();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);

  // 주간 평점 평균 데이터
  const { data: ratingData, error, isLoading: loading } = useWeeklyAverageRatingByPlatform();

  // 차트 옵션 state
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      spacingTop: 24,
      height: CAROUSEL_HEIGHT,
    },
    credits: { enabled: false },
    title: { text: undefined },
    xAxis: {
      crosshair: true,
      labels: {
        style: {
          fontSize: `${theme.typography.body2.fontSize}`,
        },
      },
    },
    yAxis: {
      title: { text: undefined },
      labels: { enabled: false },
    },
    legend: {
      align: 'left',
      layout: 'vertical',
      verticalAlign: 'bottom',
      itemMarginBottom: 30,
      labelFormat: ' ',
      margin: 0,
      symbolWidth: theme.spacing(4),
      symbolHeight: theme.spacing(3),
    },
    tooltip: {
      shared: true,
      useHTML: true,
      shape: 'callout',
      padding: 4,
      style: {
        fontSize: `${theme.typography.body2.fontSize}`,
      },
      headerFormat: `<span style="font-size: ${theme.typography.body2.fontSize};">{point.key}</span>`,
      pointFormatter(this: Highcharts.Point) {
        const { y, series, color } = this;
        return `
        <div>
          <span style="color: ${color}; margin-right: 20px;">${series.name}</span> 
          <span>평균평점 : ${Highcharts.numberFormat(y as number, 2, undefined, ',')} 점</span>
        </div>
        `;
      },
    },
  });

  // data변경시 (데이터를 불러왔을 때) 실행 -> 그래프 series옵션 변경하여 그래프 그림
  useEffect(() => {
    if (!ratingData) return;
    const { dates, afreeca, twitch } = ratingData;
    const markerSize = {
      width: theme.spacing(3),
      height: theme.spacing(3),
    };

    setChartOptions({
      chart: {
        backgroundColor: theme.palette.background.paper,
      },
      series: [
        {
          type: 'line',
          name: '아프리카',
          data: afreeca,
          color: getPlatformColor('afreeca'),
          marker: {
            symbol: 'url(/images/logo/afreecaLogo.png)',
            ...markerSize,
          },
        },
        {
          type: 'line',
          name: '트위치',
          data: twitch,
          color: getPlatformColor('twitch'),
          marker: {
            symbol: 'url(/images/logo/twitchLogo.png)',
            ...markerSize,
          },
        },
      ],
      xAxis: {
        categories: dates,
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
    });
  }, [ratingData, theme, theme.palette.background.paper, theme.palette.text.primary]);

  // 에러핸들러
  if (error) {
    ShowSnack('주간 평점 평균 데이터를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
  }

  return (
    <section className={classes.weeklyContainer}>
      <CarouselItemHeader title="주간 평점 평균" />

      <div className={classes.graphContainer}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>

      {loading && (
      <CenterLoading />
      )}

    </section>
  );
}

export default WeeklyLineCard;
