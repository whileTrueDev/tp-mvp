import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesKelly from '@amcharts/amcharts4/themes/kelly';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import graphColor from './Color';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';

// @hwasurr - 2020.10.13 eslint error 정리 중
// any 타입 disable 처리. => 작성자@chanuuuu가 올바른 타입 정의 수정바랍니다.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function setComponent(data: any, theme: TruepointTheme): am4charts.XYChart {
  am4core.useTheme(am4themesKelly);
  am4core.useTheme(am4themesAnimated);

  const lightColor = am4core.color(theme.palette.primary.light);
  const darkColor = am4core.color(theme.palette.primary.dark);

  const chart: am4charts.XYChart = am4core.create('chartdiv', am4charts.XYChart);
  chart.data = data;
  chart.dateFormatter.inputDateFormat = 'i';
  chart.paddingRight = 15;
  chart.paddingLeft = 5;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd HH:mm:ss';
  dateAxis.periodChangeDateFormats.setKey('minute', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  dateAxis.periodChangeDateFormats.setKey('hour', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  dateAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  // dateAxis.periodChangeDateFormats.setKey('day', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  // dateAxis.groupData = true;

  // ****************************** smile count series ***************************
  const valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  valueAxis.renderer.opposite = true;
  if (chart.yAxes.indexOf(valueAxis) !== 0) {
    valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  }
  const series: any = chart.series.push(new am4charts.LineSeries());

  series.yAxis = valueAxis;
  series.dataFields.valueY = 'smile_count';
  series.groupFields.valueY = 'average';
  series.dataFields.dateX = 'date';
  series.name = '웃음 발생 수';
  series.tooltipText = '웃음 발생 수: [bold]{smile_count}[/]';
  series.strokeWidth = 2.5;
  series.tensionX = 0.8;
  series.connect = false;
  series.hidden = true; // 기본 그래프 설정.

  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = 'vertical';
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = 'middle';
  series.tooltip.label.textValign = 'middle';

  // ****************************** chat count series ***************************
  const newSeries = chart.series.push(new am4charts.LineSeries());
  const chatAxis = chart.yAxes.push(new am4charts.ValueAxis());
  chatAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  chatAxis.renderer.opposite = true;
  newSeries.yAxis = chatAxis;
  newSeries.dataFields.valueY = 'chat_count';
  newSeries.dataFields.dateX = 'date';
  newSeries.stroke = am4core.color(graphColor.line); // red
  if (newSeries.tooltip) {
    newSeries.tooltip.getFillFromObject = false;
    newSeries.tooltip.background.fill = am4core.color(graphColor.line);
  }
  // pieSeries.tooltip.label.fill = am4core.color("#000");
  newSeries.name = '채팅 발생 수';
  newSeries.strokeWidth = 2.5;
  newSeries.tensionX = 0.8;
  newSeries.groupFields.valueY = 'average';
  newSeries.tooltipText = '채팅 발생 수: [bold]{chat_count}[/]';
  newSeries.connect = false;
  newSeries.hidden = true; // 기본 그래프 설정.

  // ****************************** avg viewer count series ***************************
  /**
   * 평균 시청자수 타임라인 레이블 임시 제거
   * S3 metrics json 타임라인에 viewer 프로퍼티가 추가 될 때 까지
   */

  // const viewerSeries = chart.series.push(new am4charts.LineSeries());
  // const viewerAxis = chart.yAxes.push(new am4charts.ValueAxis());
  // viewerAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  // viewerSeries.yAxis = viewerAxis;
  // viewerSeries.dataFields.valueY = 'viewer';
  // viewerSeries.dataFields.dateX = 'date';
  // viewerSeries.stroke = am4core.color(graphColor.viewer); // red
  // if (viewerSeries.tooltip) {
  //   viewerSeries.tooltip.getFillFromObject = false;
  //   viewerSeries.tooltip.background.fill = am4core.color(graphColor.viewer);
  // }
  // viewerSeries.tooltip.label.fill = am4core.color(graphColor.viewer);
  // viewerSeries.name = '평균 시청자 수';
  // viewerSeries.strokeWidth = 2.5;
  // viewerSeries.tensionX = 0.8;
  // viewerSeries.tooltipText = '평균 시청자 수: [bold]{viewer}[/]';
  // viewerSeries.hidden = true; // 기본 그래프 설정.

  // ****************************** cursor ***************************
  // Make a panning cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;

  // ****************************** scroll bar ***************************
  // Create a horizontal scrollbar with previe and place it underneath the date axis
  const scrollbarX: any = new am4charts.XYChartScrollbar();
  scrollbarX.minHeight = 20;
  scrollbarX.startGrip.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.endGrip.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.thumb.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.startGrip.background.states.getKey('down').properties.fill = darkColor;
  scrollbarX.endGrip.background.states.getKey('down').properties.fill = darkColor;
  scrollbarX.thumb.background.states.getKey('down').properties.fill = darkColor;
  // chart.scrollbarX.parent = chart.bottomAxesContainer;
  chart.scrollbarX = scrollbarX;
  chart.scrollbarX.background.fill = lightColor;
  chart.scrollbarX.startGrip.background.fill = lightColor;
  chart.scrollbarX.endGrip.background.fill = lightColor;
  chart.scrollbarX.thumb.background.fill = lightColor;

  // dateAxis.start = 0.75;
  dateAxis.keepSelection = true;
  // And, for a good measure, let's add a legend
  const legend = new am4charts.Legend();
  legend.labels.template.fill = am4core.color(theme.palette.text.secondary);
  chart.legend = legend;

  return chart;
}
