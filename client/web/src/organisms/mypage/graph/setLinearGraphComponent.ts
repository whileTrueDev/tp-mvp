import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import graphColor from './Color';
// import { timelineGraphInterface } from './graphsInterface';

const metricSetting: any = {
  smile: {
    name: '웃음 발생 수',
    valueY: 'smileCount',
    tooltipText: '웃음 발생 수: [bold]{smileCount}[/]',
    color: am4core.color(graphColor.line),
  },
  chat: {
    name: '채팅 발생 수',
    valueY: 'chatCount',
    tooltipText: '채팅 발생 수: [bold]{chatCount}[/]',
    color: am4core.color(graphColor.broad1),
  },
  viewer: {
    name: '평균 시청자 수',
    valueY: 'viewer',
    tooltipText: '평균 시청자 수: [bold]{viewer}[/]',
    color: am4core.color(graphColor.broad2),
  },
};

// 선택된 metric list
const setSeries = (
  metrics: string[], chart: am4charts.XYChart, opposite?: number, fontColor?: string,
): void => {
  metrics.forEach((element, index) => {
    const setting = metricSetting[`${element}`];
    const valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = (index % 2) ? !opposite : opposite;
    if (chart.yAxes.indexOf(valueAxis) !== 0) {
      valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
    valueAxis.renderer.labels.template.fill = am4core.color(fontColor || '#000');

    const series: any = chart.series.push(new am4charts.LineSeries());
    series.yAxis = valueAxis;
    series.dataFields.valueY = setting.valueY;
    series.dataFields.dateX = 'startedAt';
    series.name = setting.name;
    series.tooltipText = setting.tooltipText;
    series.strokeWidth = 2.5;
    series.tensionX = 0.8;
    series.tooltip.getFillFromObject = false;
    series.stroke = setting.color; // red
    series.tooltip.background.fill = setting.color;
    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = 'middle';
    series.tooltip.label.textValign = 'middle';
  });
};
// @hwasurr - 2020.10.13 eslint error 정리 중
// any 타입 disable 처리. => 작성자@chanuuuu가 올바른 타입 정의 수정바랍니다.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function setComponent(data: any[],
  selectedMetric: string[], name?: string, opposite?: number, fontColor?: string): am4charts.XYChart {
  // console.log(data);
  am4core.useTheme(am4themesAnimated);
  const chart: am4charts.XYChart = am4core.create(name || 'chartdiv', am4charts.XYChart);
  chart.data = data;
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
  chart.paddingRight = 15;
  chart.paddingLeft = 5;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd';
  dateAxis.dateFormats.setKey('day', 'MM-dd');
  setSeries(selectedMetric, chart, opposite, fontColor);
  dateAxis.renderer.labels.template.fill = am4core.color(fontColor || '#000');
  // ****************************** cursor ***************************
  // Make a panning cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  const legend = new am4charts.Legend();
  legend.labels.template.fill = am4core.color(fontColor || '#000');
  chart.legend = legend;

  return chart;
}
