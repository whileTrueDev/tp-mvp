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
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      height: ScoresHistorySectionHeight,
      spacing: [16, 16, 16, 16],
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%y-%m-%d}',
      },
    },
    yAxis: {
      title: { text: undefined },
    },
    legend: {
      enabled: false,
    },

    plotOptions: {
      series: {
        connectNulls: true,
      },
    },
  });
  const [{ data }] = useAxios<ScoreHistoryData[]>({
    url: '/rankings/scores/history',
    method: 'get',
    params: {
      creatorId,
    },
  });

  const [buttonState, setButtonState] = useState<keyof ScoreHistoryData>('viewer');

  useEffect(() => {
    if (!data) return;
    const minDate = data[0].date || undefined;
    const maxDate = data[data.length - 1].date || undefined;
    let series = data.map((item) => [dayjs(item.date).valueOf(), item[buttonState]]);
    const isEmptyData = series.every((elem) => elem[1] === null);
    if (isEmptyData) {
      series = [];
    }
    let max: number | null = null;
    if (!['viewer', 'rating'].includes(buttonState)) {
      max = 10;
    }
    const min = buttonState === 'rating' ? null : 0;
    setChartOptions({
      series: [
        {
          type: 'line',
          data: series,
        },
      ],
      xAxis: {
        min: dayjs(minDate).valueOf(),
        max: dayjs(maxDate).valueOf(),
      },
      yAxis: {
        min,
        max,
      },
      lang: {
        noData: '매겨진 별점이 없습니다. 별점을 매겨보세요!',
      },
      noData: {
        position: {
          align: 'center',
          verticalAlign: 'middle',
        },

      },
    });
  }, [buttonState, data]);

  return (
    <Grid container style={{ backgroundColor: 'white' }}>
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
              onClick={() => setButtonState(button.key)}
              startIcon={isDownXs ? undefined : button.icon}
              variant="outlined"
              size={isDownSm ? 'small' : 'medium'}
              style={{
                backgroundColor: buttonState === button.key ? theme.palette.primary.main : 'transparent',
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
