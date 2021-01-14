import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { createTitle, createYCategoryAxis, createXAxisAndSeries } from './barChartFunctions';

am4core.useTheme(am4themesAnimated);

interface SortedBarChartType extends Record<string, any>{
  negativeWords: any[];
  positiveWords: any[];
}

// 데이터 내림차순 정렬 후 상위 limit개 리턴
function manipulateData(data: Record<string, any>[], limit: number) {
  return data.sort((a: any, b: any) => (b.value - a.value))
    .slice(0, limit);
}
const chartOption = {
  cornerRadius: 10,
  yAxisSpace: 100,
  labelDx: 20,
  limit: 6,
};
export default function SortedBarChart(props: SortedBarChartType): JSX.Element {
  const theme = useTheme();
  const { negativeWords, positiveWords } = props;
  const chartRef = useRef<any>(null);
  const mainColor = useRef<string>(theme.palette.primary.main);
  const subColor = useRef<string>(theme.palette.grey[300]);

  // 데이터 내림차순 정렬 후 상위 limit개 리턴
  const positiveData = manipulateData(positiveWords, chartOption.limit);
  const negativeData = manipulateData(negativeWords, chartOption.limit);

  const totalLength = positiveWords.length + negativeWords.length;

  const getPercentage = useCallback(
    (words: Record<string, any>[]) => (
      totalLength
        ? Math.floor((words.length / totalLength) * 100)
        : 0
    ), [totalLength],
  );

  useLayoutEffect(() => {
    // 차트
    // 참고한 코드 https://codepen.io/team/amcharts/pen/PoPwZRr?editors=0010
    const chart = am4core.create('pos-neg-words-bar-chart-div', am4charts.XYChart);
    chart.maskBullets = false;

    // 그래프 가로로 배열 // https://codepen.io/team/amcharts/pen/xxxQGgZ?editors=0010
    chart.bottomAxesContainer.layout = 'horizontal';
    chart.bottomAxesContainer.reverseOrder = true; // 생성 역순으로 배치되어서 순서 reverse함

    // 제목과 퍼센트 포함하는 컨테이너
    const titleContainer = chart.chartContainer.createChild(am4core.Container);
    titleContainer.layout = 'horizontal';
    titleContainer.toBack();
    titleContainer.width = am4core.percent(100);
    titleContainer.reverseOrder = true;// 생성 역순으로 배치되어서 순서 reverse함

    // 제목 생성, 
    const titleData = [
      {
        targetContainer: titleContainer,
        type: 'positive',
        text: {
          label: '긍정단어',
          color: mainColor.current,
          percent: getPercentage(positiveWords),
        },
      },
      {
        targetContainer: titleContainer,
        type: 'negative',
        text: {
          label: '부정단어',
          color: subColor.current,
          percent: getPercentage(negativeWords),
        },
      },
    ];
    titleData.forEach((title) => {
      const {
        targetContainer, type, text,
      } = title;
      createTitle(targetContainer, type, text);
    });

    // y축 생성
    const yAxisData = [
      // 긍정단어 축
      {
        targetChart: chart, name: 'positive', data: positiveData, dataField: 'text',
      },
      // 순서(1,2,3,4...) 축
      {
        targetChart: chart,
        name: 'order',
        data: Array(chartOption.limit).fill(0).map((d, i) => (
          { order: i + 1 })),
        dataField: 'order',
      },
      // 부정단어 축
      {
        targetChart: chart, name: 'negative', data: negativeData, dataField: 'text',
      },
    ];

    const categoryAxis = yAxisData.map((yAxis) => {
      const {
        targetChart, name, data, dataField,
      } = yAxis;
      return createYCategoryAxis(targetChart, name, data, dataField);
    });

    const positiveWordYAxis = categoryAxis[0];
    const negativeWordYAxis = categoryAxis[2];

    // series생성
    const seriesData = [
      // 긍정단어
      {
        targetChart: chart,
        option: {
          name: 'positiveSeries',
          color: mainColor.current,
          chartOption,
        },
        data: positiveData,
        yAxis: positiveWordYAxis,
      },
      // 부정단어
      {
        targetChart: chart,
        option: {
          name: 'negativeSeries',
          color: subColor.current,
          chartOption,
        },
        data: negativeData,
        yAxis: negativeWordYAxis,
      },
    ];

    const series = seriesData.map((eachData) => {
      const {
        targetChart, option, data, yAxis,
      } = eachData;
      return createXAxisAndSeries(targetChart, option, data, yAxis);
    });

    const positiveSeries = series[0];
    const negativeSeries = series[1];

    // y축 sort
    positiveWordYAxis.sortBySeries = positiveSeries;
    negativeWordYAxis.sortBySeries = negativeSeries;

    chartRef.current = chart;
    return () => {
      chart.dispose();
    };
  }, [negativeData, positiveData, positiveWords, negativeWords, getPercentage]);

  return (
    <div id="pos-neg-words-bar-chart-div" style={{ width: '100%', height: '500px' }} />
  );
}
