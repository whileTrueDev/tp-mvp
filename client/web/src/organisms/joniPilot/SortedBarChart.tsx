import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { makeTitle, createYCategoryAxis, createXAxisAndSeries } from './barChartFunctions';

am4core.useTheme(am4themesAnimated);

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
const chartOption = {
  cornerRadius: 10,
  yAxisSpace: 100,
  labelDx: 20,
};
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
    makeTitle(titleContainer,
      'negative',
      {
        label: '부정단어',
        color: subColor.current,
      },
      getPercentage(negativeWords));

    makeTitle(titleContainer,
      'positive',
      {
        label: '긍정단어',
        color: mainColor.current,
      },
      getPercentage(positiveWords));

    // y축 긍정단어->순서->부정단어 순으로 생성한다
    const positiveWordYAxis = createYCategoryAxis(chart, 'positive', positiveData, 'text');
    createYCategoryAxis(chart, 'order', positiveData, 'order');
    const negativeWordYAxis = createYCategoryAxis(chart, 'negative', negativeData, 'text');

    // series 긍정단어 -> 부정단어 순으로 생성한다
    // 긍정단어 series
    const positiveSeries = createXAxisAndSeries(
      chart,
      {
        name: 'positiveSeries',
        color: mainColor.current,
        chartOption,
      },
      positiveData,
      positiveWordYAxis,
    );

    // 부정단어 series
    const negativeSeries = createXAxisAndSeries(
      chart,
      {
        name: 'negativeSeries',
        color: subColor.current,
        chartOption,
      },
      negativeData,
      negativeWordYAxis,
    );

    // y축 sort
    positiveWordYAxis.sortBySeries = positiveSeries;
    negativeWordYAxis.sortBySeries = negativeSeries;

    // Stack axes 
    // https://codepen.io/team/amcharts/pen/xxxQGgZ?editors=0010
    // 그래프 가로로 배열
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
