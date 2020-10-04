import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

interface ChartProps {
  data: any,
}

export default function Chart({ data }: ChartProps): JSX.Element {

  const chart = am4core.create('chartdiv', am4charts.XYChart);
  chart.data = data;

  // Create axes
  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  // const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = 'value';
  series.dataFields.dateX = 'date';
  series.tooltipText = '{value}';

  // series.tooltip.pointerOrientation = 'vertical';

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;
  chart.scrollbarX = new am4core.Scrollbar();

  return (
    <div id="chartdiv" />
  )
}