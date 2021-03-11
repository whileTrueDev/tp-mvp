import React, { useEffect, useState } from 'react';
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
    series, renderer, plotLeft, plotTop,
  } = this;
  if (series.length === 0) return;

  // renderer.rect(50, 10, 799, 299).attr({
  //   fill: 'green',
  // }).add();

  const { xAxis: afreecaXAxis } = series[0];
  const { xAxis: twitchXAxis } = series[1];
  const { center: afreecaCenterCoord } = afreecaXAxis as CustomAxisType;
  const { center: twitchCenterCoord } = twitchXAxis as CustomAxisType;
  const scale = 1.15;
  // 아프리카 arc
  const afreecaRadius = (afreecaCenterCoord[2] / 2) * scale;
  renderer.arc(
    afreecaCenterCoord[0] + plotLeft,
    afreecaCenterCoord[1] + plotTop,
    afreecaRadius, afreecaRadius,
    (Math.PI / 180) * 90, (Math.PI / 180) * 270,
  ).attr({
    stroke: blue[900],
    'stroke-width': 3,
  }).add();
  // 트위치 arc
  const twitchRadius = (twitchCenterCoord[2] / 2) * scale;
  renderer.arc(
    twitchCenterCoord[0] + plotLeft,
    twitchCenterCoord[1] + plotTop,
    twitchRadius, twitchRadius,
    (Math.PI / 180) * -90, (Math.PI / 180) * 90,
  ).attr({
    stroke: purple[500],
    'stroke-width': 3,
  }).add();
}

/**
 * 두 플랫폼 총 시청자수에 따라 차트사이즈 반환
 * 큰쪽은 사이즈 300, 작은쪽은 200
 * @param afreecaTotal 아프리카 총 시청자수
 * @param twitchTotal 트위치 총 시청자수
 * @returns [afreecaChartSize: number, twitchChartSize: number]
 */
function getChartSize(afreecaTotal: number, twitchTotal: number) {
  const bigSize = 300;
  const smallSize = 200;
  const afreecaChartSize = afreecaTotal > twitchTotal ? bigSize : smallSize;
  const twitchChartSize = afreecaTotal < twitchTotal ? bigSize : smallSize;

  return [afreecaChartSize, twitchChartSize];
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    position: 'absolute',
    zIndex: 10,
    transform: 'translate(20%,30%)',
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '45%',
    zIndex: 10,
    '& img': {
      width: '100%',
      maxWidth: '50px',
    },
  },
  afreecaCount: {
    position: 'absolute',
    left: '20%',
  },
  twitchCount: {
    position: 'absolute',
    right: '20%',
  },
}));

function ViewerComparisonPolarAreaCard(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const [{ data, loading, error }] = useAxios<{afreeca: DailyTotalViewersData, twitch: DailyTotalViewersData}>('/rankings/daily-total-viewers');
  const tickInterval = 360 / 10;

  // Multiple polar charts https://www.highcharts.com/forum/viewtopic.php?t=42296#p148602
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
      center: ['40%', '50%'],
      startAngle: 36 * (-2), // x축 시작 위치 default 0 (12시방향)// 괄호안의 값 : 가장 큰 파이가 위치할 칸 번호
    }, {
      center: ['60%', '50%'],
      startAngle: 36 * (2),
    }] as Highcharts.PaneOptions, // pane 타입정의가 배열을 못받게 되어있어서 임시로 타입 단언 사용함
    yAxis: [
      { pane: 0, labels: { enabled: false }, gridLineWidth: 0 },
      { pane: 1, labels: { enabled: false }, gridLineWidth: 0 },
    ],
    xAxis: [{
      reversed: true,
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
        pointPlacement: 'between', // column차트가 x축 사이에 들어가도록
        dataLabels: {
          enabled: true,
          color: theme.palette.common.white,
          align: 'center',
          verticalAlign: 'middle',
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
    if (!data) return;
    const { afreeca, twitch } = data;
    const [afreecaChartSize, twitchChartSize] = getChartSize(afreeca.total, twitch.total);

    setOptions({
      pane: [{
        size: afreecaChartSize,
      }, {
        size: twitchChartSize,
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
          <Typography>{`${data?.afreeca.total || 0} 명`}</Typography>
        </div>
        <div className={classes.twitchCount}>
          <img src="/images/logo/twitchLogo.png" alt="트위치 로고" />
          <Typography>{`${data?.twitch.total || 0} 명`}</Typography>
        </div>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
      {loading && <CenterLoading />}
    </section>
  );
}

export default ViewerComparisonPolarAreaCard;
