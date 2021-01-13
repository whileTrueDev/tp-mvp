import React, { useRef, useLayoutEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

// conatiner내에 xy차트 생성하는 함수
function makeXYChart(container: am4core.Container, type: string, data: any, color: string): am4charts.XYChart {
  const xyChart = container.createChild(am4charts.XYChart);
  xyChart.data = data;
  xyChart.padding(30, 30, 30, 30);
  xyChart.colors.list = [am4core.color(color)]; // 차트 색깔
  xyChart.maskBullets = false;
  return xyChart;
}

// targetChart 내에 상단에 그래프 이름과 퍼센트 표시하는 컨테이너 생성 함수
function makeTitle(targetChart: am4charts.XYChart, type: string, percent: number) {
  const topContainer = targetChart.chartContainer.createChild(am4core.Container);
  topContainer.layout = 'absolute';
  topContainer.toBack();
  topContainer.paddingBottom = 30;
  topContainer.width = am4core.percent(100);

  const title = topContainer.createChild(am4core.Label);
  title.text = type === 'negative' ? '부정단어' : '긍정단어';
  title.align = type === 'negative' ? 'right' : 'left';
  title.fontSize = 30;

  const percentage = topContainer.createChild(am4core.Label);
  percentage.text = `${percent} %`;
  percentage.align = type === 'negative' ? 'right' : 'left';
  percentage.fontSize = 30;
  percentage.x = 30;
}
// targetChart 내에 y축 CategoryAxis 생성하는 함수
function makeYCategoryAxis(targetChart: am4charts.XYChart, type: string) {
  const categoryAxis = targetChart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = 'text';
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 1;
  categoryAxis.renderer.inversed = true; // 큰 값 먼저  보여지도록 함
  categoryAxis.renderer.opposite = type === 'negative'; // type== negative 이면 yAxes 위치 반대로
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.cellStartLocation = 0.3; // cell 간격 말고 막대 크기 조절 어떻게 하는지 못찾음
  categoryAxis.renderer.cellEndLocation = 0.7;
  categoryAxis.renderer.align = type === 'negative' ? 'right' : 'left';
  categoryAxis.layout = 'absolute';
  return categoryAxis;
}
// targetChart 내에 x축 ValueAxis 생성하는 함수
function makeXValueAxis(targetChart: am4charts.XYChart, type: string) {
  const valueAxis = targetChart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.inversed = type === 'negative'; // negative 인 경우 차트 방향 반대로
  valueAxis.renderer.grid.template.disabled = true; // x축 그리드 사용 안함
  valueAxis.renderer.labels.template.disabled = true; // x축 label 사용 안함
  valueAxis.min = 0;
  valueAxis.max = 23; // 가짜데이터에서 들어오는 최대 value: 20
  return valueAxis;
}

// targetChart내에 series 생성하는 함수
function makeSeries(targetChart: am4charts.XYChart, type: string) {
  const series = targetChart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryY = 'text';
  series.dataFields.valueX = 'value';
  series.tooltipText = '{valueX.value}';
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadius(5, 5, 5, 5);

  const labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.horizontalCenter = 'left';
  labelBullet.label.verticalCenter = 'middle';
  labelBullet.label.dx = type === 'negative' ? -20 : 10;
  labelBullet.label.text = '{value}';
  labelBullet.locationX = 0;
}
interface SortedBarChartType extends Record<string, any>{
  negativeWords: any;
  positiveWords: any;
}

// 데이터 내림차순 정렬 후 상위 limit개 리턴
function manipulateData(data: Record<string, any>[], limit: number) {
  return data.sort((a: any, b: any) => (b.value - a.value))
    .slice(0, limit)
    .map((item: any, index: number) => ({ ...item, index: index + 1 }));
}

export default function SortedBarChart(props: SortedBarChartType): JSX.Element {
  const theme = useTheme();
  const { negativeWords, positiveWords } = props;
  const chart = useRef<any>(null);
  const mainColor = useRef<string>(theme.palette.primary.main);
  const subColor = useRef<string>(theme.palette.grey[300]);

  const positiveData = manipulateData(positiveWords, 6);
  const negativeData = manipulateData(negativeWords, 6);

  const totalLength = positiveWords.length + negativeWords.length;
  function getPercentage(words: Record<string, any>[]) {
    return Math.floor((words.length / totalLength) * 100);
  }

  useLayoutEffect(() => {
    // 부정단어, 긍정단어 그래프 감싸는 컨테이너
    const mainContainer = am4core.create('chartdiv-container', am4core.Container);
    mainContainer.padding(30, 30, 30, 30);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = 'horizontal';

    // 부정단어 그래프
    const negativeBarChart = makeXYChart(mainContainer, 'negative', negativeData, mainColor.current);

    // 부정단어 타이틀, 퍼센트
    makeTitle(negativeBarChart, 'negative', getPercentage(negativeWords));
    // 부정단어 y축 단어
    makeYCategoryAxis(negativeBarChart, 'negative');
    // 부정단어 x축 값
    makeXValueAxis(negativeBarChart, 'negative');
    // 부정단어 그래프 바
    makeSeries(negativeBarChart, 'negative');

    //--------------
    // 순서
    //------------------
    // 긍정단어 그래프
    const positiveBarChart = makeXYChart(mainContainer, 'positive', positiveData, subColor.current);

    // 긍정단어 타이틀, 퍼센트
    makeTitle(positiveBarChart, 'positive', getPercentage(positiveWords));
    // 긍정단어그래프 y축 단어
    makeYCategoryAxis(positiveBarChart, 'positive');
    // 긍정단어그래프 x축 값
    makeXValueAxis(positiveBarChart, 'positive');
    // 긍정단어 그래프 바
    makeSeries(positiveBarChart, 'positive');

    chart.current = mainContainer;

    return () => {
      mainContainer.dispose();
    };
  }, [negativeData, positiveData]);

  return (
    <div id="chartdiv-container" style={{ width: '100%', height: '500px' }} />
  );
}
