import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import graphColor from './Color';

const metricSetting: any = {
  smile: {
    name: '웃음 발생 수',
    valueY: 'smileCount',
    tooltipText: '웃음 발생 수: [bold]{smileCount}[/]',
    color: am4core.color(graphColor.line)
  },
  chat: {
    name: '채팅 발생 수',
    valueY: 'chatCount',
    tooltipText: '채팅 발생 수: [bold]{chatCount}[/]',
    color: am4core.color(graphColor.broad1)
  },
  viewer: {
    name: '평균 시청자 수',
    valueY: 'viewer',
    tooltipText: '평균 시청자 수: [bold]{viewer}[/]',
    color: am4core.color(graphColor.broad2)
  }
};

// 선택된 metric list
const setSeries = (metrics: string[], chart: am4charts.XYChart, opposite?: number): void => {
  metrics.forEach((element, index) => {
    const setting = metricSetting[`${element}`];
    const valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = (index % 2) ? !opposite : opposite;
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

export default function setComponent(data: any, name?: string, opposite?: number): am4charts.XYChart {
  am4core.useTheme(am4themes_animated);
  const chart : am4charts.XYChart = am4core.create(name || 'chartdiv', am4charts.XYChart);
  chart.data = data;
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
  chart.paddingRight = 15;
  chart.paddingLeft = 5;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd';
  dateAxis.dateFormats.setKey('day', 'MM-dd');
  setSeries(['viewer', 'smile'], chart, opposite);

  // ****************************** cursor ***************************
  // Make a panning cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.legend = new am4charts.Legend();

  return chart;
}
