import React, { useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

export default function ChartExample(): JSX.Element {
  useLayoutEffect(() => {
    const x = am4core.create('chartdiv', am4charts.XYChart);

    x.paddingRight = 20;

    const data = [];
    let visits = 10;

    for (let i = 1; i < 366; i += 1) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: `name${i}`, value: visits });
    }

    x.data = data;

    const dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    if (valueAxis.tooltip) {
      valueAxis.tooltip.disabled = true;
    }
    valueAxis.renderer.minWidth = 35;

    const series = x.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '{valueY.value}';
    x.cursor = new am4charts.XYCursor();

    return () => { x.dispose(); };
  }, []);

  return (
    <div id="chartdiv" style={{ width: '100%', height: '300px' }} />
  );
}
