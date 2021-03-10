import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCmore from 'highcharts/highcharts-more'; // polar area chart 사용 위해 필요

import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import { Divider, Typography } from '@material-ui/core';
import CenterLoading from '../../../atoms/Loading/CenterLoading';

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
}

type Color = typeof blue | typeof purple; // material ui color객체, blue: 아프리카용, purple: 트위치용
type ColorIndex = keyof Color; // material ui color 인덱스값

/**
 * 폴라차트에서 표현할 형태로 
 * 백엔드에서 받은 플랫폼별 24시간내 시청자 상위 10명 데이터를 변형하는 함수
 * 시청자수 순위별로 1 3 5 7 9 8 6 4 2 순서로 배치하여 반환한다(최대 시청자 9번째가 가운데에 온다)
 * 
 * @param list 플랫폼별 24시간내 시청자 상위 10명 데이터 목록
 * @param colors material ui color객체, blue: 아프리카용, purple: 트위치용
 */
function toPolarAreaData(list: DailyTotalViewersItemData[], colors: Color) {
  const odd: CustomPointOption[] = [];
  const even: CustomPointOption[] = [];
  list.forEach((d: DailyTotalViewersItemData, i: number) => {
    const colorIndex = ((9 - Math.ceil(i / 2)) - 2) * 100; // 700 ~ 200까지(material ui color 인덱스값)
    const values = {
      originValue: d.maxViewer, // 실제 최대시청자수 -> 툴팁에서 보여줄 값
      y: (9 - Math.ceil(i * 0.7)) * 100, // 실제값은 별도로 넣고, 표시될 크기 y는 순위에 따라 일정하게 적용
      // y: d.maxViewer,
      name: d.creatorName,
      order: i, // order < 5 상위 5인만 이름을 표시한다
      color: colors[colorIndex as ColorIndex], // 순위에 따라 다른 색을 적용한다
    };
    if (i < 3 || i % 2 === 0) {
      even.push(values);
    } else {
      odd.push(values);
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

const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
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
  const classes = useStyles();
  const [{ data, loading, error }] = useAxios<{afreeca: DailyTotalViewersData, twitch: DailyTotalViewersData}>('/rankings/daily-total-viewers');
  const tickInterval = 360 / 10;

  // Multiple polar charts https://www.highcharts.com/forum/viewtopic.php?t=42296#p148602
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: { type: 'column', polar: true },
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
      { pane: 0, labels: { enabled: false } },
      { pane: 1, labels: { enabled: false } },
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
          color: '#FFFFFF',
          align: 'center',
          verticalAlign: 'middle',
          formatter: polarAreaLabelFormatter,
        },
      },
      column: {
        pointPadding: 0,
        groupPadding: 0,
        grouping: false,
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    const { afreeca, twitch } = data;

    const bigSize = 300;
    const smallSize = 200;
    const afreecaChartSize = afreeca.total > twitch.total ? bigSize : smallSize;
    const twitchChartSize = afreeca.total < twitch.total ? bigSize : smallSize;
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
