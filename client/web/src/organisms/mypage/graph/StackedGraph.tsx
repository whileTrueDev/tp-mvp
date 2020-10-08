import React, {
  useRef, useLayoutEffect
} from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { metricGraphInterface } from './graphsInterface';
import graphColor from './Color';

export default function Index({ name, comeData }:
  {name: string, comeData: metricGraphInterface[]}): JSX.Element {
  am4core.useTheme(am4themes_animated);
  const chartRef = useRef<any>(null);

  const theme = useTheme();

  useLayoutEffect(() => {
    // Create chart instance
    const chart = am4core.create(`chartdiv_${name}`, am4charts.XYChart);
    chart.paddingRight = 18;
    chart.paddingLeft = 0;

    chart.data = comeData;

    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.axisFills.template.disabled = true;
    categoryAxis.renderer.axisFills.template.fillOpacity = 0.05;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = -100;
    valueAxis.max = 100;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.labels.template.adapter.add('text', (text) => `${Math.abs(Number(text))}%`);
    valueAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.secondary);
    // // Legend
    // chart.legend = new am4charts.Legend();
    // chart.legend.position = 'right';

    // Create series
    function createSeries(field: string, seriesName: string, color: am4core.Color) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'category';
      series.stacked = true;
      series.name = seriesName;
      series.stroke = color;
      series.fill = color;

      const label = series.bullets.push(new am4charts.LabelBullet());
      label.label.text = '{valueX.formatNumber(\'##| ##s |##\')}  %';
      label.label.fill = am4core.color('#fff');
      label.label.strokeWidth = 2;
      label.label.truncate = false;
      label.label.hideOversized = true;
      label.locationX = 0.5;
      return series;
    }

    createSeries('broad1', 'A', am4core.color(graphColor.broad1));
    createSeries('broad2', 'B', am4core.color(graphColor.broad2));

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [name, comeData]);

  return (
    <div>

      <div id={`chartdiv_${name}`} style={{ height: '120px' }} />
    </div>
  );
}
