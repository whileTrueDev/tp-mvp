import React, { useRef, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

interface SortedBarChartType extends Record<string, any>{
  negativeWords: any;
  positiveWords: any;
}
export default function SortedBarChart(props: SortedBarChartType): JSX.Element {
  const { negativeWords, positiveWords } = props;
  const chart = useRef<any>(null);

  useLayoutEffect(() => {
    const mainContainer = am4core.create('chartdiv-container', am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = 'horizontal';

    // 부정단어
    const negativeBarChart = mainContainer.createChild(am4charts.XYChart);

    negativeBarChart.padding(40, 40, 40, 40);
    negativeBarChart.data = negativeWords.slice(0, 6);

    const negativeCategoryAxis = negativeBarChart.yAxes.push(new am4charts.CategoryAxis());
    negativeCategoryAxis.title.text = '부정단어'; // Label로 대체가능
    negativeCategoryAxis.dataFields.category = 'text';
    negativeCategoryAxis.renderer.grid.template.location = 0;
    negativeCategoryAxis.renderer.minGridDistance = 1;
    negativeCategoryAxis.renderer.inversed = true; // 내림차순
    negativeCategoryAxis.renderer.opposite = true; // yAxes 위치 반대로
    negativeCategoryAxis.renderer.grid.template.disabled = true;

    const negativeValueAxis = negativeBarChart.xAxes.push(new am4charts.ValueAxis());
    negativeValueAxis.renderer.inversed = true; // 차트 방향 반대로
    negativeValueAxis.renderer.grid.template.disabled = true; // x축 그리드 사용 안함
    negativeValueAxis.renderer.labels.template.disabled = true; // x축 label 사용 안함
    negativeValueAxis.min = 0;

    const negativeSeries = negativeBarChart.series.push(new am4charts.ColumnSeries());
    negativeSeries.dataFields.categoryY = 'text';
    negativeSeries.dataFields.valueX = 'value';
    negativeSeries.tooltipText = '{valueX.value}';
    negativeSeries.columns.template.strokeOpacity = 0;
    negativeSeries.columns.template.column.cornerRadiusBottomLeft = 5;
    negativeSeries.columns.template.column.cornerRadiusBottomRight = 5;
    negativeSeries.columns.template.column.cornerRadiusTopLeft = 5;
    negativeSeries.columns.template.column.cornerRadiusTopRight = 5;

    const negativeLabelBullet = negativeSeries.bullets.push(new am4charts.LabelBullet());
    negativeLabelBullet.label.horizontalCenter = 'left';
    negativeLabelBullet.label.dx = 10;
    negativeLabelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    negativeLabelBullet.locationX = 1;

    negativeCategoryAxis.sortBySeries = negativeSeries;

    // 긍정단어
    const positiveBarChart = mainContainer.createChild(am4charts.XYChart);

    positiveBarChart.padding(40, 40, 40, 40);
    positiveBarChart.data = positiveWords.slice(0, 6);

    const positiveCategoryAxis = positiveBarChart.yAxes.push(new am4charts.CategoryAxis());
    positiveCategoryAxis.renderer.grid.template.location = 0;
    positiveCategoryAxis.dataFields.category = 'text';
    positiveCategoryAxis.renderer.minGridDistance = 1;
    positiveCategoryAxis.renderer.inversed = true;
    positiveCategoryAxis.renderer.grid.template.disabled = true;

    const positiveValueAxis = positiveBarChart.xAxes.push(new am4charts.ValueAxis());
    positiveValueAxis.renderer.grid.template.disabled = true; // x축 그리드 사용 안함
    positiveValueAxis.renderer.labels.template.disabled = true; // x축 label 사용 안함
    positiveValueAxis.min = 0;

    const positiveSeries = positiveBarChart.series.push(new am4charts.ColumnSeries());
    positiveSeries.dataFields.categoryY = 'text';
    positiveSeries.dataFields.valueX = 'value';
    positiveSeries.tooltipText = '{valueX.value}';
    positiveSeries.columns.template.strokeOpacity = 0;
    positiveSeries.columns.template.column.cornerRadiusBottomLeft = 5;
    positiveSeries.columns.template.column.cornerRadiusBottomRight = 5;
    positiveSeries.columns.template.column.cornerRadiusTopLeft = 5;
    positiveSeries.columns.template.column.cornerRadiusTopRight = 5;

    const positiveLabelBullet = positiveSeries.bullets.push(new am4charts.LabelBullet());
    positiveLabelBullet.label.horizontalCenter = 'left';
    positiveLabelBullet.label.dx = 10;
    positiveLabelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    positiveLabelBullet.locationX = 1;

    positiveCategoryAxis.sortBySeries = positiveSeries;

    chart.current = mainContainer;

    return () => {
      mainContainer.dispose();
    };
  }, [negativeWords, positiveWords]);

  return (
    <div id="chartdiv-container" style={{ width: '100%', height: '500px' }} />
  );
}
