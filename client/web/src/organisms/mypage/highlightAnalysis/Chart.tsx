import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

interface ChartProps {
  data: any,
  chartType: string,
  highlight?: any,
  handleClick: (a: any) => void,
  handlePage: any,
  pageSize: number
}

const metricSetting: any = {
  smile: {
    name: '웃음 발생 수',
    valueY: 'score',
    dateX: 'start_time',
    tooltipText: '[bold]{score}[/]',
    tooltipColor: '#ff3e7a',
  },
  chat: {
    name: '채팅 발생 수',
    valueY: 'score',
    dateX: 'start_time',
    tooltipText: '[bold]{score}[/]',
    tooltipColor: '#ff3e7a'
  },
  highlight: {
    name: '트루포인트 편집점',
    valueY: 'score',
    dateX: 'start_time',
    tooltipText: '[bold]{score}[/]',
    tooltipColor: '#ff3e7a'
  }
};

export default function Chart({
  data,
  chartType,
  highlight,
  handleClick,
  handlePage,
  pageSize
}: ChartProps): JSX.Element {
  am4core.useTheme(am4themes_animated);
  const chart = am4core.create(`${chartType}chartdiv`, am4charts.XYChart);
  chart.data = data;

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.skipEmptyPeriods = true;
  dateAxis.tooltipDateFormat = 'HH:mm:ss';
  dateAxis.dateFormats.setKey('second', 'yyyy-MM-dd HH:mm:ss');

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.scrollbarX = new am4core.Scrollbar();
  chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';

  const setSeries = (metricsType: string, getChart: am4charts.XYChart): void => {
    const setting = metricSetting[metricsType];
    const valueAxis: any = getChart.yAxes.push(new am4charts.ValueAxis());
    if (chart.yAxes.indexOf(valueAxis) !== 0) {
      valueAxis.syncWithAxis = getChart.yAxes.getIndex(0);
    }
    const series : any = getChart.series.push(new am4charts.LineSeries());
    series.yAxis = valueAxis;
    series.dataFields.valueY = setting.valueY;
    series.dataFields.dateX = setting.dateX;
    series.name = setting.name;
    series.tooltipText = setting.tooltipText;
    series.strokeWidth = 2.5;
    series.tensionX = 0.8;
    series.stroke = am4core.color('#7E8CF7');
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.getFillFromObject = false;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.label.textAlign = 'middle';
    series.tooltip.label.textValign = 'middle';
    series.tooltip.background.fill = am4core.color(setting.tooltipColor);

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    console.log(bullet)
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color(setting.tooltipColor);
    bullet.disabled = false;
    bullet.events.on('hit', (ev: any) => {
      const point = ev.target.dataItem.dataContext;
      handleClick({
        start_index: point.start_index,
        end_index: point.end_index,
        index: point.tableData.id
      })
      handlePage(Math.floor(point.tableData.id / pageSize));
    });

    const bullethover = bullet.states.create('hover');
    bullethover.properties.scale = 2;
  };

  setSeries(chartType, chart);

  // if (highlight) {
  //   bullet.states
  // }

  return (
    <div id={`${chartType}chartdiv`} style={{width: '100%', height: 350}} />
  );
}
