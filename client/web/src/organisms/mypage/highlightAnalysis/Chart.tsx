import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

interface ChartProps {
  data: any,
  chartType: string
}

const metricSetting: any = {
  smile: {
    name: '웃음 발생 수',
    valueY: 'smileCount',
    tooltipText: '웃음 발생 수: [bold]{smileCount}[/]',
  },
  chat: {
    name: '채팅 발생 수',
    valueY: 'chatCount',
    tooltipText: '채팅 발생 수: [bold]{chatCount}[/]',
  }
};

const setSeries = (metricsType: string, chart: am4charts.XYChart): void => {
  const setting = metricSetting[`${metricsType}`];
  const valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
  if (chart.yAxes.indexOf(valueAxis) !== 0) {
    valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  }
  const series : any = chart.series.push(new am4charts.LineSeries());
  series.yAxis = valueAxis;
  series.dataFields.valueY = setting.valueY;
  series.dataFields.dateX = 'date';
  series.name = setting.name;
  series.tooltipText = setting.tooltipText;
  series.strokeWidth = 2.5;
  series.tensionX = 0.8;
  series.tooltip.getFillFromObject = false;
  series.stroke = setting.color; // red`
  series.tooltip.background.fill = setting.color;
  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = 'vertical';
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = 'middle';
  series.tooltip.label.textValign = 'middle';
};

export default function Chart({ data, chartType }: ChartProps): JSX.Element {
  am4core.useTheme(am4themes_animated);
  const chart = am4core.create('chartdiv', am4charts.XYChart);
  chart.data = data;

  // Create axes
  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd';
  dateAxis.dateFormats.setKey('day', 'MM-dd');

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

  // chan
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

  setSeries(chartType, chart);

  return (
    <div id="chartdiv" />
  );
}
