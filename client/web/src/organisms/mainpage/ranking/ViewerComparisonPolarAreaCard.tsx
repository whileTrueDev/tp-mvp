import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import { Divider, Typography } from '@material-ui/core';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCmore from 'highcharts/highcharts-more'; // polar area chart 사용 위해 필요

import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';

import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

import { useStyles as usePolatChartStyles } from './polar/polarChartStyle';
import {
  getChartSize,
  toPolarAreaData,
  polarAreaLabelFormatter,
  createArc,
  createGradationBlobBackground,
  CustomPointOption,
  DailyTotalViewersItemData,
} from './polar/polarChartUtils';

HCmore(Highcharts);// polar area chart 사용 위해 필요
interface DailyTotalViewersData{
  total: number;
  data: DailyTotalViewersItemData[];
}
/**
 * 폴라차트 툴팁 포맷 지정함수
 * toPolarAreaData 에서 생성된 originValue값(실제 최대시청자 값)을 툴팁에 표시한다
 * @param this Highcharts.TooltipFormatterContextObject
 */
function polarAreaTooltipFormatter(this: Highcharts.TooltipFormatterContextObject) {
  const { point } = this;
  const { options: pointOptions, name } = point;
  const { originValue, order } = pointOptions as CustomPointOption;
  return `${order === 0 ? '🥇' : ''}
          ${order === 1 ? '🥈' : ''}
          ${order === 2 ? '🥉' : ''}
          ${order + 1}위 <br />
          ${name} <br />
          ${Highcharts.numberFormat(originValue as number, 0, undefined, ',')} 명`;
}

const commonXAxisOptions = {
  lineWidth: 0,
  min: 0,
  max: 360,
  labels: { enabled: false },
};

function ViewerComparisonPolarAreaCard(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = usePolatChartStyles();
  const theme = useTheme();
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);
  const afreecaLogoRef = useRef<HTMLDivElement>(null); // 아프리카 로고 & 총 시청자수 컴포넌트 ref
  const twitchLogoRef = useRef<HTMLDivElement>(null); // 트위치 로고 & 총 시청자수 컴포넌트 ref
  // 플랫폼별 시청자수 상위 10인의 데이터
  const [{ data, loading, error }] = useAxios<{afreeca: DailyTotalViewersData, twitch: DailyTotalViewersData}>('/rankings/daily-total-viewers');
  const tickInterval = 360 / 10; // 원을 10개의 칸으로 나눔
  // 기본 차트 옵션
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
      polar: true,
    },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: '' },
    pane: [{
      startAngle: tickInterval * (-2), // x축 시작 위치, 12시 방향인 0 을 기준으로 함. -2 이면 왼쪽 두번째 칸부터 시작
    }, {
      startAngle: tickInterval * (2), // 양수값이면 오른쪽 두번째 칸부터 시작
    }] as Highcharts.PaneOptions, // pane 타입정의가 배열을 못받게 되어있어서 임시로 타입 단언 사용함
    yAxis: [
      { pane: 0, labels: { enabled: false }, gridLineWidth: 0 },
      { pane: 1, labels: { enabled: false }, gridLineWidth: 0 },
    ],
    xAxis: [{
      reversed: true, // 오른쪽 차트와 대칭되도록 
      pane: 0,
      tickInterval,
      ...commonXAxisOptions,
    }, {
      pane: 1,
      tickInterval,
      ...commonXAxisOptions,
    }],
    plotOptions: {
      series: {
        pointInterval: tickInterval,
        pointPlacement: 'between',
        dataLabels: {
          enabled: true,
          color: theme.palette.common.white,
          align: 'center',
          verticalAlign: 'middle',
          style: {
            fontSize: `${theme.typography.caption.fontSize}`,
          },
          formatter: polarAreaLabelFormatter,
        },
        states: { hover: { brightness: 0.3 } },
      },
      column: {
        pointPadding: 0,
        groupPadding: 0,
        grouping: false,
      },
    },
    tooltip: {
      useHTML: true,
      style: { fontSize: `${theme.typography.body2.fontSize}` },
      formatter: polarAreaTooltipFormatter,
    },
  });

  if (error) {
    console.error(error);
    ShowSnack('상위 10인 시청자수 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
  }

  // 데이터가 변경되었을 때 실행하는 훅
  // 1.플랫폼 별 총 시청자 수에 따라 차트 크기와 중심 좌표를 계산,
  // 2.물방울 모양 그라데이션 배경 생성
  // 3.차트 옆 반원모양 호 생성
  // 4.로고 위치 조정
  // 5.차트옵션 변경 - 시청자수에 따라 차트 크기 조정, series 데이터 추가
  useEffect(() => {
    if (!chartRef.current || !data) return;
    const { afreeca, twitch } = data;

    const compensationPx = -30; // 차트 크기(지름) 조정값
    const [afreecaChartSize, twitchChartSize] = getChartSize(afreeca.total, twitch.total, compensationPx);
    const {
      plotWidth, plotHeight, renderer, plotLeft, plotTop,
    } = chartRef.current.chart;
    const verticalCenter = plotHeight * 0.5; // 차트 y좌표값
    const horizontalCenter = plotWidth * 0.5; // 차트 x좌표 기본값

    const supplementDistance = compensationPx * 0.2; // 차트 크기(지름) 조정값에 따라 차트 중심 x좌표값을 조절한다
    const afreecaHorizontalCenter = horizontalCenter - afreecaChartSize / 2 + supplementDistance;
    const twitchHorizontalCenter = horizontalCenter + twitchChartSize / 2 - supplementDistance;
    // 아프리카 차트 x,y좌표와 반지름r
    const afreecaChartCoord = {
      x: afreecaHorizontalCenter + plotLeft,
      y: verticalCenter + plotTop,
      r: afreecaChartSize / 2,
    };
    // 트위치 차트 x,y좌표와 반지름r
    const twitchChartCoord = {
      x: twitchHorizontalCenter + plotLeft,
      y: verticalCenter + plotTop,
      r: twitchChartSize / 2,
    };

    // 물방울모양 그라데이션 배경 그리기---------------------------------------------------
    createGradationBlobBackground(renderer, [afreecaChartCoord, twitchChartCoord]);

    // 호 그리기---------------------------------------------------
    const afreecaArc = createArc(renderer, afreecaChartCoord, 'left', blue[400]);
    afreecaArc.add();
    const twitchArc = createArc(renderer, twitchChartCoord, 'right', purple[400]);
    twitchArc.add();

    // 로고 위치 조정---------------------------------------------------
    const { x: afreecaArcX } = afreecaArc.getBBox();
    const { x: twitchArcX, width: twitchArcWidth } = twitchArc.getBBox();
    const distanceFromArc = 30; // arc에서 얼마나 떨어질것인지 px단위

    if (afreecaLogoRef.current) {
      afreecaLogoRef.current.style.setProperty('right', `${(plotWidth - afreecaArcX) + distanceFromArc}px`);
    }
    if (twitchLogoRef.current) {
      twitchLogoRef.current.style.setProperty('left', `${(twitchArcX + twitchArcWidth) + distanceFromArc}px`);
    }

    // 차트옵션 변경 - 시청자수에 따라 차트 크기 조정, series 데이터 추가
    setOptions({
      pane: [{
        size: afreecaChartSize,
        center: [`${afreecaHorizontalCenter}`, `${verticalCenter}`],
      }, {
        size: twitchChartSize,
        center: [`${twitchHorizontalCenter}`, `${verticalCenter}`],
      }] as Highcharts.PaneOptions, // pane 타입정의가 배열을 못받게 되어있어서 임시로 타입 단언 사용함
      series: [{
        type: 'column',
        name: 'afreeca',
        yAxis: 0,
        xAxis: 0,
        data: toPolarAreaData(afreeca.data, blue),
      }, {
        type: 'column',
        name: 'twitch',
        data: toPolarAreaData(twitch.data, purple),
        yAxis: 1,
        xAxis: 1,
      }],
    });
  }, [data]);

  return (
    <section className={classes.polarAreaContainer}>
      <div className={classes.title}>
        <Typography variant="h6">아프리카tv VS 트위치tv</Typography>
        <Divider />
        <Typography variant="h5">상위 10인 시청자수 합 비교</Typography>
      </div>

      { data
        ? (
          <div className={classes.totalCount}>
            <div className={classes.afreecaCount} ref={afreecaLogoRef}>
              <img src="/images/logo/afreecaLogo.png" alt="아프리카 로고" />
              <Typography align="center">{`${data ? Highcharts.numberFormat(data.afreeca.total, 0, undefined, ',') : 0} 명`}</Typography>
            </div>
            <div className={classes.twitchCount} ref={twitchLogoRef}>
              <img src="/images/logo/twitchLogo.png" alt="트위치 로고" />
              <Typography align="center">{`${data ? Highcharts.numberFormat(data.twitch.total, 0, undefined, ',') : 0} 명`}</Typography>
            </div>
          </div>
        )
        : null}

      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      {loading && <CenterLoading />}
    </section>
  );
}

export default ViewerComparisonPolarAreaCard;
