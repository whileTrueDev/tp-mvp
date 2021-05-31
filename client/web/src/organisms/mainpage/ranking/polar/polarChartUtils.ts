import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import { DailyTotalViewersItemData } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
// 타입----------------------------------------------------------
export interface CustomPointOption extends Highcharts.PointOptionsObject {
  y: number;
  name: string;
  order: number;
  color: string;
  originValue: number;
}
type Color = typeof blue | typeof purple; // material ui color객체, blue: 아프리카용, purple: 트위치용
type ColorIndex = keyof Color; // material ui color 인덱스값

//---------------------------------------------------------------------------
// polar chart 컴포넌트 내에서 사용하는 함수들

/**
 * 폴라차트에서 표현할 형태로 
 * 백엔드에서 받은 플랫폼별 24시간내 시청자 상위 10명 데이터를 변형하는 함수
 * 
 * @param list 플랫폼별 24시간내 시청자 상위 10명 데이터 목록
 * @param colors material ui color객체, blue: 아프리카용, purple: 트위치용
 */
export function toPolarAreaData(list: DailyTotalViewersItemData[], colors: Color): CustomPointOption[] {
  const odd: CustomPointOption[] = [];
  const even: CustomPointOption[] = [];
  if (list.length === 0) {
    return [];
  }
  const tempList = [...list];

  // 만약 당일 방송한 사람이 10인 이하인 경우 10개를 채워서 위치를 맞춘다
  if (tempList.length < 10) {
    for (let i = 0; i < 10 - list.length; i += 1) {
      tempList.push({
        maxViewer: 0,
        creatorName: '',
        creatorId: '',
      });
    }
  }
  tempList.forEach((d: DailyTotalViewersItemData, i: number) => {
    const colorIndex = ((9 - Math.ceil(i / 2)) - 3) * 100; // 600 ~ 100까지(material ui color 인덱스값)
    const pointOptions = {
      originValue: d.maxViewer, // 실제 최대시청자수 -> 툴팁에서 보여줄 값
      y: d.maxViewer ? (9 - Math.ceil(i * 0.7)) * 100 : 0, // 실제값은 별도로 넣고 표시될 크기 y는 순위에 따라 일정하게 적용
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
export function polarAreaLabelFormatter(this: Highcharts.PointLabelObject): string | null {
  const { point } = this;
  const { options: pointOptions } = point;
  const opt = pointOptions as CustomPointOption;
  return opt.order < 5 ? opt.name : null;
}

/**
 * 두 플랫폼 총 시청자수에 따라 차트사이즈(지름) 반환
 * compensationPx값으로 차트 지름 크기 조절이 가능하다
 * 
 * @param afreecaTotal 아프리카 총 시청자수
 * @param twitchTotal 트위치 총 시청자수
 * @compensationPx 차트 지름 크기 보정값(픽셀단위). 양수일 경우 (기본차트사이즈 + compensationPx)px / 음수일 경우 (기본차트사이즈 - compensationPx)px
 * @returns [afreecaChartSize: number, twitchChartSize: number]
 */
export function getChartSize(afreecaTotal: number, twitchTotal: number, compensationPx = 0): number[] {
  const bigSize = 190 + compensationPx; // 큰 차트 지름
  const smallSize = 120 + compensationPx; // 작은 차트 지름
  if (afreecaTotal === twitchTotal) {
    return [150, 150]; // [아프리카, 트위치]
  }
  const afreecaChartSize = afreecaTotal > twitchTotal ? bigSize : smallSize;
  const twitchChartSize = afreecaTotal < twitchTotal ? bigSize : smallSize;

  return [afreecaChartSize, twitchChartSize];
}

// ----------------------------------------------
// svg 관련
/**
 * 물방울이 이어진 효과 표현하기 위한 svg filter생성 & 그림자 효과 filter  생성
 * @param renderer 
 */
export function createSVGFilters(renderer: Highcharts.SVGRenderer): void {
  // 물방울이 이어진 효과(gooey-effect) filter
  const filter = renderer.createElement('filter')
    .attr({
      id: 'gooey-effect', // 해당 필터의 id를 필터 적용할 svg 엘리먼트의 fill attribute로 설정한다
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

  // 물방울 뒤 그림자 효과 filter
  const shadowFilter = renderer.createElement('filter')
    .attr({
      id: 'shadow-effect',
    }).add(renderer.defs);
  renderer.createElement('feDropShadow').attr({
    dx: '0',
    dy: '0',
    stdDeviation: '10', // blur의 정도. 10 이상일 시 이상하게 나타남
    'flood-color': '#000000', // shadow color
    'flood-opacity': '0.5', // shadow opacity
  }).add(shadowFilter);
}

/**
 * 물방울 모양 svg 엘리먼트 생성
 * circle 두개를 만들어 필터를 적용한다
 * 배경이 될 svg요소 담고있는 그룹요소인 g#blobs-container 를 반환한다 
 * @param renderer 
 * @param blobs [afreecaChartCoord{x,y,r}, twitchChartCoord{x,y,r}]
 * @return container:Highcharts.SVGElement
 */
export function createBlobs(
  renderer: Highcharts.SVGRenderer,
  blobs: {x: number, y: number, r: number}[],
): Highcharts.SVGElement {
  const blobOuterScale = 1.15;// 배경의 지름이 차트 지름의 몇배가 될 것인지

  const container = renderer.g('blobs-container');
  container.add();
  // 그림자를 먼저 생성
  const shadowG = renderer.g('shadow-blobs').add(container);
  blobs.forEach((blob) => {
    renderer.circle({
      cx: blob.x, cy: blob.y, r: blob.r * blobOuterScale, fill: 'white', filter: 'url(#shadow-effect)',
    }).add(shadowG);
  });

  // 그림자 생성 후 물방울 배경을 생성
  const g = renderer.g('blobs').attr({
    filter: 'url(#gooey-effect)', // createSVGFilters에서 작성한 filter 적용
  }).add(container);
  const middleColor = '#a4a4fa';
  const gradientColorStops = [
    { startColor: blue[200], endColor: middleColor },
    { startColor: middleColor, endColor: purple[200] },
  ];
  blobs.forEach((blob, index) => {
    const { startColor, endColor } = gradientColorStops[index];
    renderer.circle({
      cx: blob.x,
      cy: blob.y,
      r: blob.r * blobOuterScale,
      fill: {
        linearGradient: {
          x1: 0, y1: 0, x2: 1, y2: 0,
        },
        stops: [
          [0, startColor],
          [1, endColor],
        ],
      },
    }).add(g);
  });

  return container;
}

/**
 * 폴라차트 기준으로 왼쪽, 혹은 오른쪽으로 반원 모양의 호를 생성한다
 * return 값에 .add() 메서드를 호출해야 화면에 그려짐
 * 
 * @param renderer Highcharts.SVGRenderer
 * @param coord 기준이 될 폴라차트 x,y좌표와 폴라차트의 반지름 r
 * @param direction 왼쪽, 오른쪽 여부
 * @param color 호의 색
 * @returns Highcharts.SVGElement
 */
export function createArc(
  renderer: Highcharts.SVGRenderer,
  coord: {x: number, y: number, r: number},
  direction: 'left'|'right',
  color: string,
): Highcharts.SVGElement {
  const startAngle = direction === 'left' ? 90 : -90;
  const endAlgne = direction === 'left' ? 270 : 90;
  const strokeWidth = 4; // 선의 굵기
  const arcOuterScale = 1.3;
  const radius = coord.r * arcOuterScale;// (폴라차트 반지름 r * arcOuterScale) 만큼의 반지름 가지는 호가 생성됨
  return renderer.arc(
    coord.x,
    coord.y,
    radius, radius,
    (Math.PI / 180) * startAngle, (Math.PI / 180) * endAlgne,
  ).attr({
    stroke: color,
    'stroke-width': strokeWidth,
  }).addClass(`arc-${direction}`);
}

/**
 * 그라데이션 && 물방울 모양 배경------SVG filters https://jsfiddle.net/jL72qh55/9/
 * 1. svg filter(#gooey-effect) 생성
 * 2. 물방울 모양&그림자 생성
 * 3. 차트 옆 호(arc) 생성
 * @param renderer Highcharts.SVGRenderer
 * @param blobCoords [afreecaChartCoord, twitchChartCoord]
 * @return 
  container: Highcharts.SVGElement 배경과 호를 포함하고 있는 컨테이너 요소
  afreecaArc: Highcharts.SVGElement 아프리카 차트 쪽에 그려지는 arc
  twitchArc: Highcharts.SVGElement 트위치 차트 쪽에 그려지는 arc
 */
export function createBackground(
  renderer: Highcharts.SVGRenderer,
  blobCoords: {x: number, y: number, r: number}[],
): {
  container: Highcharts.SVGElement,
  afreecaArc: Highcharts.SVGElement,
  twitchArc: Highcharts.SVGElement,
} {
  // 1. 필터 생성(블러, contrast, shadow) - 필터가 존재하지 않는 경우만 생성하도록
  if (!renderer.defs.element.querySelector('#gooey-effect')) {
    createSVGFilters(renderer);
  }

  // 2. 물방울 모양 & 그림자 생성
  const container = createBlobs(renderer, blobCoords);
  // 3. 차트 옆 호(arc) 생성
  const afreecaArc = createArc(renderer, blobCoords[0], 'left', blue[400]);
  afreecaArc.add(container);
  const twitchArc = createArc(renderer, blobCoords[1], 'right', purple[400]);
  twitchArc.add(container);

  return { container, afreecaArc, twitchArc };
}

interface Coord {
  x: number;
  y: number;
  r: number;
}
interface PaneOptions{
    size: number;
    center: string[];
}
/**
 * 플랫폼 별 총 시청자 수에 따라 차트 크기와 중심 좌표를 반환
 * @param afreecaTotal 
 * @param twitchTotal 
 * @param chart 
 * @returns 
 *  afreecaChartCoord  아프리카 차트 x,y좌표와 반지름r
    twitchChartCoord  트위치 차트 x,y좌표와 반지름r
    afreecaPaneOptions 아프리카 차트 크기와 중심 정보 (pane옵션에 사용)
    twitchPaneOptions 트위치 차트 크기와 중심 정보 (pane옵션에 사용)
 */
export function getCoordsAndPanes(afreecaTotal: number, twitchTotal: number, chart: Highcharts.Chart): {
  afreecaChartCoord: Coord,
  twitchChartCoord: Coord,
  afreecaPaneOptions: PaneOptions,
  twitchPaneOptions: PaneOptions,
} {
  const compensationPx = -30; // 차트 크기(지름) 조정값
  const [afreecaChartSize, twitchChartSize] = getChartSize(afreecaTotal, twitchTotal, compensationPx);
  const {
    plotWidth, plotHeight, plotLeft, plotTop,
  } = chart;
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

  const afreecaChartCenter = [`${afreecaHorizontalCenter}`, `${verticalCenter}`];
  const twitchChartCenter = [`${twitchHorizontalCenter}`, `${verticalCenter}`];

  const afreecaPaneOptions = {
    size: afreecaChartSize,
    center: afreecaChartCenter,
  };
  const twitchPaneOptions = {
    size: twitchChartSize,
    center: twitchChartCenter,
  };
  return {
    afreecaChartCoord,
    twitchChartCoord,
    afreecaPaneOptions,
    twitchPaneOptions,
  };
}
