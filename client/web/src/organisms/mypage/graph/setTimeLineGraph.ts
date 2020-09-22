import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import graphColor from './Color';

export default function setComponent(data: any, theme: any): am4charts.XYChart {
  am4core.useTheme(am4themes_kelly);
  am4core.useTheme(am4themes_animated);

  const lightColor = am4core.color(theme.palette.primary.light);
  const darkColor = am4core.color(theme.palette.primary.dark);

  const chart : am4charts.XYChart = am4core.create('chartdiv', am4charts.XYChart);
  chart.data = data;
  chart.dateFormatter.inputDateFormat = 'i';
  chart.paddingRight = 15;
  chart.paddingLeft = 5;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd HH:mm:ss';
  // dateAxis.dateFormats.setKey('minute', 'MM-dd HH:mm');
  dateAxis.periodChangeDateFormats.setKey('minute', '[bold]MM-dd[/]'); // 일간의 간격(gap)에 대한 명시를 하기 위해
  // dateAxis.groupData = true;

  chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  const series : any = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = 'smile_count';
  series.groupFields.valueY = 'average';
  series.dataFields.dateX = 'date';
  series.name = '웃음 발생 수';
  series.tooltipText = '웃음 발생 수: [bold]{smile_count}[/]';
  series.strokeWidth = 2.5;
  series.tensionX = 0.8;
  series.connect = false;
  series.hidden = true;

  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = 'vertical';
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 40;
  series.tooltip.label.textAlign = 'middle';
  series.tooltip.label.textValign = 'middle';

  // series 추가 
  const new_series : any = chart.series.push(new am4charts.LineSeries());
  new_series.dataFields.valueY = 'chat_count';
  new_series.dataFields.dateX = 'date';
  new_series.stroke = am4core.color(graphColor.line); // red
  new_series.tooltip.getFillFromObject = false;
  new_series.tooltip.background.fill = am4core.color(graphColor.line);
  // pieSeries.tooltip.label.fill = am4core.color("#000");
  new_series.name = '채팅 발생 수';
  new_series.strokeWidth = 2.5;
  new_series.tensionX = 0.8;
  new_series.groupFields.valueY = 'average';
  new_series.tooltipText = '채팅 발생 수: [bold]{chat_count}[/]';
  new_series.connect = false;

  // Make a panning cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;

  // Create a horizontal scrollbar with previe and place it underneath the date axis
  const scrollbarX : any = new am4charts.XYChartScrollbar();
  scrollbarX.minHeight = 20;
  // 추후에 theme.platte 처리 필요
  scrollbarX.startGrip.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.endGrip.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.thumb.background.states.getKey('hover').properties.fill = lightColor;
  scrollbarX.startGrip.background.states.getKey('down').properties.fill = darkColor;
  scrollbarX.endGrip.background.states.getKey('down').properties.fill = darkColor;
  scrollbarX.thumb.background.states.getKey('down').properties.fill = darkColor;

  chart.scrollbarX = scrollbarX;
  // chart.scrollbarX.parent = chart.bottomAxesContainer;
  chart.scrollbarX.background.fill = lightColor;
  chart.scrollbarX.startGrip.background.fill = lightColor;
  chart.scrollbarX.endGrip.background.fill = lightColor;
  chart.scrollbarX.thumb.background.fill = lightColor;

  // dateAxis.start = 0.75;
  dateAxis.keepSelection = true;
  // And, for a good measure, let's add a legend
  chart.legend = new am4charts.Legend();

  return chart;
}
