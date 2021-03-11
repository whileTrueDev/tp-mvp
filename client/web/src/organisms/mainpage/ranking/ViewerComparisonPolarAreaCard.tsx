import React, { useEffect, useRef, useState } from 'react';
import {
  createStyles, makeStyles, Theme, useTheme,
} from '@material-ui/core/styles';
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

HCmore(Highcharts);// polar area chart 사용 위해 필요

interface DailyTotalViewersItemData{
  maxViewer: number;
  creatorName: string;
  creatorId: string;
}
interface DailyTotalViewersData{
  total: number;
  data: DailyTotalViewersItemData[];
}
interface CustomPointOption extends Highcharts.PointOptionsObject {
  y: number;
  name: string;
  order: number;
  color: string;
  originValue: number;
}
interface CustomAxisType extends Highcharts.Axis{
  center: number[];
}

type Color = typeof blue | typeof purple; // material ui color객체, blue: 아프리카용, purple: 트위치용
type ColorIndex = keyof Color; // material ui color 인덱스값

/**
 * 폴라차트에서 표현할 형태로 
 * 백엔드에서 받은 플랫폼별 24시간내 시청자 상위 10명 데이터를 변형하는 함수
 * 
 * @param list 플랫폼별 24시간내 시청자 상위 10명 데이터 목록
 * @param colors material ui color객체, blue: 아프리카용, purple: 트위치용
 */
function toPolarAreaData(list: DailyTotalViewersItemData[], colors: Color) {
  const odd: CustomPointOption[] = [];
  const even: CustomPointOption[] = [];
  list.forEach((d: DailyTotalViewersItemData, i: number) => {
    const colorIndex = ((9 - Math.ceil(i / 2)) - 3) * 100; // 600 ~ 100까지(material ui color 인덱스값)
    const pointOptions = {
      originValue: d.maxViewer, // 실제 최대시청자수 -> 툴팁에서 보여줄 값
      y: (9 - Math.ceil(i * 0.7)) * 100, // 실제값은 별도로 넣고, 표시될 크기 y는 순위에 따라 일정하게 적용
      // y: d.maxViewer,
      name: d.creatorName,
      order: i, // 상위 5인(order < 5 )만 이름을 표시한다, 0부터 시작함(0번째가 1위)
      color: colors[colorIndex as ColorIndex], // 순위에 따라 다른 색을 적용한다
    };

    // 배열 순서가 시청자순 오름차순이 아니라, 1 3 5 7 9 10 8 6 4 2순으로 섞는다(시안과 유사한 형태로 그래프 표현하기 위해)
    if (i % 2 === 0) {
      even.push(pointOptions);
    } else {
      odd.push(pointOptions);
    }
  });
  return even.concat(odd.reverse());
}

/**
 * 폴라 차트 label 포맷 지정함수
 * toPolarAreaData 에서 생성된 order 값에 따라 5미만 (상위5인)인 경우에만 이름을 표시한다
 * @param this Highcharts.PointLabelObject
 */
function polarAreaLabelFormatter(this: Highcharts.PointLabelObject) {
  const { point } = this;
  const { options: pointOptions } = point;
  const opt = pointOptions as CustomPointOption;
  return opt.order < 5 ? opt.name : null;
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

function onRender(this: Highcharts.Chart, event: Event) {
  const {
    series, renderer, plotLeft, plotTop, plotWidth, plotHeight,
  } = this;
  if (series.length === 0) return;
  const { xAxis: afreecaXAxis } = series[0];
  const { xAxis: twitchXAxis } = series[1];
  const { center: afreecaCenter } = afreecaXAxis as CustomAxisType;
  const { center: twitchCenter } = twitchXAxis as CustomAxisType;
  const afreecaChartCoord = {
    x: afreecaCenter[0] + plotLeft,
    y: afreecaCenter[1] + plotTop,
    r: afreecaCenter[2] / 2,
  };
  const twitchChartCoord = {
    x: twitchCenter[0] + plotLeft,
    y: twitchCenter[1] + plotTop,
    r: twitchCenter[2] / 2,
  };

  /**
   * 그라데이션 && 물방울 모양 배경------SVG filters https://jsfiddle.net/jL72qh55/9/
   * 1. svg filter(#gooey-effect) 생성
   * 2. svg mask(.highcharts-blobs) 생성
   * 3. svg rect 생성 : gradient 적용 && mask: 'url(#gooey-effect)' 로 필터적용
   * 4. css에서 .highcharts-blobs { -webkit-filter: 'url(#gooey-effect)'; filter: 'url(#gooey-effect)'; } 적용
   */
  // 1. 필터 생성(블러, contrast)
  const filter = renderer.createElement('filter')
    .attr({
      id: 'gooey-effect', // 해당 필터의 id를 .highcharts-blobs': {'-webkit-filter': 'url(#gooey-effect)',filter: 'url(#gooey-effect)'} 와 같이 적용한다
    }).add(renderer.defs);

  renderer.createElement('feGaussianBlur').attr({
    in: 'SourceGraphic',
    stdDeviation: '25', // blur 값
    result: 'blur',
  }).add(filter);
  renderer.createElement('feColorMatrix').attr({
    in: 'blur',
    mode: 'matrix',
    result: 'gooey-effect',
    values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7', //  알파 채널 값에 18을 곱한 다음 해당 값에서 7 * 255를 빼서 투명도 대비를 증가 https://css-tricks.com/gooey-effect/#about-color-matrices
  }).add(filter);
  renderer.createElement('feBlend').attr({
    in: 'SourceGraphic',
    in2: 'gooey-effect',
    result: 'mix',
  }).add(filter);

  // 2. 물방울 모양 마스크 생성
  const mask = renderer.createElement('mask').attr({ id: 'blobMask' }).add();
  const blobOuterScale = 1.15; // 차트 지름의 몇배만큼 배경을 보이게 할건지
  const g = renderer.g('blobs') // g('blobs') => .highcharts-blobs라는 클래스네임 적용됨. 여기에 css filter를 적용한다
    .add(mask);
  renderer.circle({
    cx: afreecaChartCoord.x, cy: afreecaChartCoord.y, r: afreecaChartCoord.r * blobOuterScale, fill: 'white',
  }).add(g);
  renderer.circle({
    cx: twitchChartCoord.x, cy: twitchChartCoord.y, r: twitchChartCoord.r * blobOuterScale, fill: 'white',
  }).add(g);

  // 3. 그라데이션 배경 -> mask프로퍼티 적용하여 물방울 모양으로 잘라냄
  renderer.rect(0, 0, plotWidth, plotHeight).attr({
    mask: 'url(#blobMask)',
    fill: {
      linearGradient: {
        x1: 0.3, y1: 0, x2: 0.7, y2: 0,
      },
      stops: [
        [0, blue[200]],
        [1, purple[200]],
      ],
    },
  }).add();

  // 호 그리기---------------------------------------------------
  const arcOuterScale = 1.28;
  const strokeWidth = 5;
  // 아프리카 arc
  const afreecaRadius = afreecaChartCoord.r * arcOuterScale;
  renderer.arc(
    afreecaChartCoord.x,
    afreecaChartCoord.y,
    afreecaRadius, afreecaRadius,
    (Math.PI / 180) * 90, (Math.PI / 180) * 270,
  ).attr({
    stroke: blue[700],
    'stroke-width': strokeWidth,
  }).add();
  // 트위치 arc
  const twitchRadius = twitchChartCoord.r * arcOuterScale;
  renderer.arc(
    twitchChartCoord.x,
    twitchChartCoord.y,
    twitchRadius, twitchRadius,
    (Math.PI / 180) * -90, (Math.PI / 180) * 90,
  ).attr({
    stroke: purple[700],
    'stroke-width': strokeWidth,
  }).add();
}

/**
 * 두 플랫폼 총 시청자수에 따라 차트사이즈 반환
 * 큰차트사이즈 300px, 작은차트 사이즈 200px 기준
 * subPx파라미터로 차트사이즈 크기 조절이 가능하다
 * 
 * @param afreecaTotal 아프리카 총 시청자수
 * @param twitchTotal 트위치 총 시청자수
 * @compensationPx 차트 크기 보정값(픽셀단위). 양수일 경우 (기본차트사이즈 + sub)px / 음수일 경우 (기본차트사이즈 - sub)px
 * @returns [afreecaChartSize: number, twitchChartSize: number]
 */
function getChartSize(afreecaTotal: number, twitchTotal: number, compensationPx = 0) {
  const bigSize = 300 + compensationPx;
  const smallSize = 200 + compensationPx;
  const afreecaChartSize = afreecaTotal > twitchTotal ? bigSize : smallSize;
  const twitchChartSize = afreecaTotal < twitchTotal ? bigSize : smallSize;

  return [afreecaChartSize, twitchChartSize];
}

/**
 * 스타일 훅
 * 4.컨테이터 클래스 polarAreaContainer 아래 .highcharts-blobs { -webkit-filter: 'url(#gooey-effect)'; filter: 'url(#gooey-effect)'; } 적용
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    '& .highcharts-blobs': {
      '-webkit-filter': 'url(#gooey-effect)',
      filter: 'url(#gooey-effect)', // 마스크에 svg필터 적용
    },
  },
  title: {
    position: 'absolute',
    zIndex: 10,
    transform: 'translate(20%,30%)',
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    zIndex: 10,
    '& img': {
      width: '100%',
      maxWidth: '100px',
    },
    '&>*': {
      transform: 'translateY(-50%)',
      position: 'absolute',
    },
  },
  afreecaCount: {
    left: '20%',
  },
  twitchCount: {
    right: '20%',
  },
}));

function ViewerComparisonPolarAreaCard(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);
  // 플랫폼별 시청자수 상위 10인의 데이터
  const [{ data, loading, error }] = useAxios<{afreeca: DailyTotalViewersData, twitch: DailyTotalViewersData}>('/rankings/daily-total-viewers');
  const tickInterval = 360 / 10; // 원을 10개의 칸으로 나눔

  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
      polar: true,
      events: { render: onRender },
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
      lineWidth: 0,
      min: 0,
      max: 360,
      labels: { enabled: false },
    }, {
      pane: 1,
      tickInterval,
      lineWidth: 0,
      min: 0,
      max: 360,
      labels: { enabled: false },
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
        states: {
          hover: {
            brightness: 0.3,
          },
        },
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

  useEffect(() => {
    if (!chartRef.current || !data) return;
    const { afreeca, twitch } = data;
    const compensationPx = -50;
    const [afreecaChartSize, twitchChartSize] = getChartSize(afreeca.total, twitch.total, compensationPx);
    const { plotWidth, plotHeight } = chartRef.current.chart;
    const verticalCenter = plotHeight * 0.5;
    const afreecaHorizontalCenter = plotWidth * 0.40 - compensationPx / 2;
    const twitchHorizontalCenter = plotWidth * 0.60 + compensationPx / 2;

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
        data: toPolarAreaData(afreeca.data, blue),
        yAxis: 0,
        xAxis: 0,
      }, {
        type: 'column',
        name: 'twitch',
        data: toPolarAreaData(twitch.data, purple),
        yAxis: 1,
        xAxis: 1,
      }],
    });
  }, [data]);

  if (error) {
    console.error(error);
    ShowSnack('상위 10인 시청자수 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
  }
  return (
    <section className={classes.polarAreaContainer}>
      <div className={classes.title}>
        <Typography variant="h6">아프리카tv VS 트위치tv</Typography>
        <Divider />
        <Typography>상위 10인 시청자수 합 비교</Typography>
      </div>

      <div className={classes.totalCount}>
        <div className={classes.afreecaCount}>
          <img src="/images/logo/afreecaLogo.png" alt="아프리카 로고" />
          <Typography align="center">{`${data ? Highcharts.numberFormat(data.afreeca.total, 0, undefined, ',') : 0} 명`}</Typography>
        </div>
        <div className={classes.twitchCount}>
          <img src="/images/logo/twitchLogo.png" alt="트위치 로고" />
          <Typography align="center">{`${data ? Highcharts.numberFormat(data.twitch.total, 0, undefined, ',') : 0} 명`}</Typography>
        </div>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      {loading && <CenterLoading />}
    </section>
  );
}

export default ViewerComparisonPolarAreaCard;
