import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesKelly from '@amcharts/amcharts4/themes/kelly';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { TimelineGraphInterface } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import graphColor from './Color';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';
// @hwasurr - 2020.10.13 eslint error 정리 중
// any 타입 disable 처리. => 작성자@chanuuuu가 올바른 타입 정의 수정바랍니다.
const getTooptip = (dateString: string) => {
  const dateArray = dateString.split(' ');
  if (dateArray.length === 1) {
    return 'yyyy-MM-dd';
  }
  return 'yyyy-MM-dd HH시';
};

export default function setComponent(data: TimelineGraphInterface[] | [],
  theme: TruepointTheme, selectedMetric?: string[]): am4charts.XYChart {
  am4core.useTheme(am4themesKelly);
  am4core.useTheme(am4themesAnimated);

  const lightColor = am4core.color(theme.palette.primary.light);
  const darkColor = am4core.color(theme.palette.primary.dark);

  const chart: am4charts.XYChart = am4core.create('chartdiv', am4charts.XYChart);
  chart.data = data;
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH';
  // chart.dateFormatter.inputDateFormat = 'i';

  chart.paddingRight = 15;
  chart.paddingLeft = 5;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = getTooptip(data[0].date);
  dateAxis.periodChangeDateFormats.setKey('month', '[bold]MM-dd[/]');
  dateAxis.periodChangeDateFormats.setKey('day', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  dateAxis.periodChangeDateFormats.setKey('hour', '[bold]MM-dd[/]');
  dateAxis.periodChangeDateFormats.setKey('minute', '[bold]MM-dd[/]');
  dateAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  // dateAxis.groupCount = 100;
  // dateAxis.renderer.inside = true; // 축 라벨을 grid 안으로 넣기/빼기
  // dateAxis.groupInterval = { timeUnit: 'day', count: 1 }; // 정적 날짜축 데이터 묶음 속성
  // dateAxis.groupData = true; //  동적 날짜축 데이터 묶음 속성
  // dateAxis.groupIntervals.setAll([ // 날짜축 묶음 속성에 대해 각 단위별 리미트를 강제 설정하는 옵션
  //   { timeUnit: 'minute', count: 1 },
  //   { timeUnit: 'hour', count: 1 },
  //   { timeUnit: 'day', count: 1 },
  // ]);
  // dateAxis.periodChangeDateFormats.setKey('hour', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  // dateAxis.periodChangeDateFormats.setKey('day', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해

  // ****************************** smile count series ***************************
  const valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  valueAxis.renderer.opposite = true;
  if (chart.yAxes.indexOf(valueAxis) !== 0) {
    valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  }
  const series: any = chart.series.push(new am4charts.LineSeries());
  series.xAxis = dateAxis;
  series.yAxis = valueAxis;
  series.dataFields.valueY = 'smile_count';
  series.groupFields.valueY = 'sum';
  series.dataFields.dateX = 'date';
  series.name = '웃음 발생 수';

  series.tooltipText = '웃음 발생 수: [bold]{smile_count}[/]';
  series.strokeWidth = 2.5;
  series.tensionX = 0.8;
  // series.hidden = true; // 기본 그래프 설정.
  series.toFront();

  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = 'vertical';
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = 'middle';
  series.tooltip.label.textValign = 'middle';

  // ****************************** chat count series ***************************
  const chatSeries = chart.series.push(new am4charts.LineSeries());
  const chatAxis = chart.yAxes.push(new am4charts.ValueAxis());
  chatAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  chatAxis.renderer.opposite = true;
  chatSeries.xAxis = dateAxis;
  chatSeries.yAxis = chatAxis;
  chatSeries.dataFields.valueY = 'chat_count';
  chatSeries.dataFields.dateX = 'date';
  chatSeries.stroke = am4core.color(graphColor.line); // red
  if (chatSeries.tooltip) {
    chatSeries.tooltip.getFillFromObject = false;
    chatSeries.tooltip.background.fill = am4core.color(graphColor.line);
  }
  // pieSeries.tooltip.label.fill = am4core.color("#000");
  chatSeries.name = '채팅 발생 수';
  chatSeries.strokeWidth = 2.5;
  chatSeries.tensionX = 0.8;
  // chatSeries.fillOpacity = 0.2;
  chatSeries.groupFields.valueY = 'sum';
  chatSeries.tooltipText = '채팅 발생 수: [bold]{chat_count}[/]';
  // chatSeries.hidden = true; // 기본 그래프 설정.
  chatSeries.toFront();

  // ****************************** avg viewer count series ***************************
  const viewerSeries = chart.series.push(new am4charts.LineSeries());
  const viewerAxis = chart.yAxes.push(new am4charts.ValueAxis());
  viewerAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
  viewerSeries.xAxis = dateAxis;
  viewerSeries.yAxis = viewerAxis;
  viewerSeries.dataFields.valueY = 'viewer_count';
  viewerSeries.dataFields.dateX = 'date';
  viewerSeries.stroke = am4core.color(graphColor.viewer); // red
  if (viewerSeries.tooltip) {
    viewerSeries.tooltip.getFillFromObject = false;
    viewerSeries.tooltip.background.fill = am4core.color(graphColor.viewer);
  }
  viewerSeries.name = '평균 시청자 수';
  viewerSeries.strokeWidth = 0.5;
  viewerSeries.fillOpacity = 0.2; // 그래프 stroke 의 배경 채움 속성
  viewerSeries.fill = am4core.color(graphColor.viewer);
  viewerSeries.tensionX = 0.8;
  viewerSeries.tooltipText = '평균 시청자 수: [bold]{viewer_count}[/]';
  viewerSeries.toBack();

  // ************************ selected metric series ************************
  if (selectedMetric) {
    series.hidden = (!selectedMetric.includes('smileCount'));
    viewerSeries.hidden = (!selectedMetric.includes('viewer'));
    chatSeries.hidden = (!selectedMetric.includes('chatCount'));
  }

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
  legend.align = 'center';
  legend.width = 500;
  legend.padding(8, 8, 8, 8);
  // 범례 글자 설정
  legend.labels.template.fill = am4core.color(theme.palette.text.primary);
  legend.labels.template.fontWeight = 'bold';
  // 범례 배경 생성
  legend.background.fill = am4core.color(theme.palette.divider);
  legend.background.fillOpacity = 0.5;
  chart.legend = legend;

  return chart;
}
