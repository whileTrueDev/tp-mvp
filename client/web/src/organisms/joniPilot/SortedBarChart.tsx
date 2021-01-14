import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

const chartOption = {
  cornerRadius: 10,
  yAxisSpace: 100,
  labelDx: 20,
};

// targetContainer 내에 상단에 그래프 이름과 퍼센트 표시하는 컨테이너 생성 함수
function makeTitle(
  targetContainer: am4core.Container,
  type: string,
  text: {label: string, color: string},
  percent: number,
) {
  const textAlign = type === 'negative' ? 'left' : 'right';

  const container = targetContainer.createChild(am4core.Container);
  container.layout = 'vertical';
  container.toBack();
  container.paddingBottom = 30;
  container.paddingRight = am4core.percent(5);
  container.paddingLeft = am4core.percent(5);
  container.width = am4core.percent(50);

  const title = container.createChild(am4core.Label);
  title.text = text.label;
  title.align = textAlign;
  title.fontSize = 30;
  title.fill = am4core.color(text.color);

  const percentage = container.createChild(am4core.Label);
  percentage.text = `${percent}%`;
  percentage.align = textAlign;
  percentage.fontSize = 30;
  percentage.fill = am4core.color(text.color);
}

// targetChart 내에 y축 aixs생성하는 함수
function createYCategoryAxis(
  targetChart: am4charts.XYChart,
  name: string,
  data: Record<string, any>[],
  category: string,
): am4charts.CategoryAxis<am4charts.AxisRenderer> {
  const yAxis = targetChart.yAxes.push(new am4charts.CategoryAxis());
  yAxis.data = data;
  yAxis.dataFields.category = category;
  yAxis.renderer.line.strokeOpacity = 1;
  yAxis.renderer.line.strokeWidth = 2;
  yAxis.renderer.line.stroke = am4core.color('#dedede');
  yAxis.renderer.inversed = true;
  yAxis.renderer.grid.template.disabled = true;
  yAxis.renderer.labels.template.textAlign = 'end';

  yAxis.renderer.cellStartLocation = 0.3;
  yAxis.renderer.cellEndLocation = 0.7;

  yAxis.parent = targetChart.plotContainer;
  yAxis.align = 'center';

  if (name === 'positive') {
    yAxis.renderer.labels.template.fill = am4core.color('#0011ff');
    yAxis.renderer.labels.template.dx = -50;
    yAxis.renderer.line.dx = -50;
  }
  if (name === 'negative') {
    yAxis.renderer.line.strokeOpacity = 0;
    yAxis.renderer.labels.template.dx = 50;
  }

  return yAxis;
}

// x축과 그래프 생성하는 함수
// 긍정그래프 -> 부정그래프 순으로 생성한다
function createXAxisAndSeries(
  targetChart: am4charts.XYChart,
  option: {name: string, color: string},
  data: Record<string, any>[],
  yAxis: am4charts.CategoryAxis<am4charts.AxisRenderer>,
): am4charts.ColumnSeries {
  const { name, color } = option;
  const xAxis = targetChart.xAxes.push(new am4charts.ValueAxis());
  xAxis.data = data;
  xAxis.min = 0;
  xAxis.max = Math.max(...data.map((d) => d.value));
  xAxis.extraMax = 0.1;
  xAxis.renderer.grid.template.disabled = true;
  xAxis.renderer.labels.template.disabled = true;
  xAxis.renderer.inversed = name.includes('positive'); // 긍정단어그래프가 왼쪽
  if (name.includes('positive')) {
    xAxis.marginRight = chartOption.yAxisSpace;
  }
  if (name.includes('negative')) {
    xAxis.marginLeft = chartOption.yAxisSpace;
  }

  const series = targetChart.series.push(new am4charts.ColumnSeries());
  series.data = data;
  series.dataFields.valueX = 'value';
  series.dataFields.categoryY = 'text';
  series.name = name;
  series.xAxis = xAxis;
  series.yAxis = yAxis;
  series.columns.template.fill = am4core.color(color);

  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadius(
    chartOption.cornerRadius,
    chartOption.cornerRadius,
    chartOption.cornerRadius,
    chartOption.cornerRadius,
  );

  const labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.horizontalCenter = name.includes('positive') ? 'left' : 'right';
  labelBullet.label.verticalCenter = 'middle';
  labelBullet.label.dx = name.includes('positive') ? chartOption.labelDx * (-1) : chartOption.labelDx;
  labelBullet.label.text = '{value}';
  labelBullet.locationX = 0;

  return series;
}

interface SortedBarChartType extends Record<string, any>{
  negativeWords: any;
  positiveWords: any;
}

// 데이터 내림차순 정렬 후 상위 limit개 리턴
function manipulateData(data: Record<string, any>[], limit: number) {
  return data.sort((a: any, b: any) => (b.value - a.value))
    .slice(0, limit)
    .map((item: any, index: number) => ({ ...item, order: index + 1 }));
}

export default function SortedBarChart(props: SortedBarChartType): JSX.Element {
  const theme = useTheme();
  const { negativeWords, positiveWords } = props;
  const chartRef = useRef<any>(null);
  const mainColor = useRef<string>(theme.palette.primary.main);
  const subColor = useRef<string>(theme.palette.grey[300]);

  // 데이터 내림차순 정렬 후 상위 limit개 리턴
  const positiveData = manipulateData(positiveWords, 6);
  const negativeData = manipulateData(negativeWords, 6);

  const totalLength = positiveWords.length + negativeWords.length;

  const getPercentage = useCallback(
    (words: Record<string, any>[]) => (
      Math.floor((words.length / totalLength) * 100)
    ), [totalLength],
  );

  useLayoutEffect(() => {
    // 차트
    // 참고한 코드 https://codepen.io/team/amcharts/pen/PoPwZRr?editors=0010
    const chart = am4core.create('pos-neg-words-bar-chart-div', am4charts.XYChart);
    chart.maskBullets = false;

    // 차트 내 부정단어, 긍정단어 제목과 퍼센트 포함하는 컨테이너
    const titleContainer = chart.chartContainer.createChild(am4core.Container);
    titleContainer.layout = 'horizontal';
    titleContainer.toBack();
    titleContainer.width = am4core.percent(100);

    // 타이틀 컨테이너 내 제목 생성, 부정단어 -> 긍정단어 순으로 생성
    makeTitle(titleContainer, 'negative', { label: '부정단어', color: subColor.current }, getPercentage(negativeWords));
    makeTitle(titleContainer, 'positive', { label: '긍정단어', color: mainColor.current }, getPercentage(positiveWords));

    // y축 긍정단어->순서->부정단어 순으로 생성한다
    // 긍정단어 y축
    const positiveWordYAxis = createYCategoryAxis(chart, 'positive', positiveData, 'text');
    // 순서 y축
    createYCategoryAxis(chart, 'order', positiveData, 'order');
    // 부정단어 y축
    const negativeWordYAxis = createYCategoryAxis(chart, 'negative', negativeData, 'text');

    // series 긍정단어 -> 부정단어 순으로 생성한다
    // 긍정단어 series
    const positiveSeries = createXAxisAndSeries(
      chart,
      { name: 'positiveSeries', color: mainColor.current },
      positiveData,
      positiveWordYAxis,
    );

    // 부정단어 series
    const negativeSeries = createXAxisAndSeries(
      chart,
      { name: 'negativeSeries', color: subColor.current },
      negativeData,
      negativeWordYAxis,
    );

    // y축 sort
    positiveWordYAxis.sortBySeries = positiveSeries;
    negativeWordYAxis.sortBySeries = negativeSeries;

    // Stack axes //https://codepen.io/team/amcharts/pen/xxxQGgZ?editors=0010
    chart.bottomAxesContainer.layout = 'horizontal';
    chart.bottomAxesContainer.reverseOrder = true;

    chartRef.current = chart;
    return () => {
      chart.dispose();
    };
  }, [negativeData, positiveData, positiveWords, negativeWords, getPercentage]);

  return (
    <div id="pos-neg-words-bar-chart-div" style={{ width: '100%', height: '500px' }} />
  );
}
