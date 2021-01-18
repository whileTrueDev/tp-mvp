import React, { useLayoutEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const containerId = 'channel-analysis-container';

export default function ChannelLineChart({ data, category }: {data: any, category: string}): JSX.Element {
  const chartRef = useRef<any>(null);
  useLayoutEffect(() => {
    const chart = am4core.create(containerId, am4charts.XYChart);
    chart.data = data;
    chart.legend = new am4charts.Legend();

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // ? 
    // https://www.amcharts.com/demos/images-as-categories/
    dateAxis.start = 0;
    dateAxis.data = data;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.groupData = true;
    dateAxis.skipEmptyPeriods = true;
    dateAxis.renderer.labels.template.adapter.add('text', (value, target, key) => {
      const { includePaidAd }: Record<string, any> = target.dataItem.dataContext;
      return includePaidAd ? 'has' : value;
    });

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.numberFormatter.numberFormat = '#.0a';

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'endDate';
    series.dataFields.valueY = category;
    series.strokeWidth = 4;
    // https://www.amcharts.com/docs/v4/tutorials/tooltips-with-rich-html-content/#Making_tooltip_stick_to_all_series
    series.tooltipHTML = `
      <div>
        <div style={{color: 'yellow';}}>
          <h2>{title}</h2>
          <p>{endDate.formatDate('yyyy-MM-dd')}</p>
        </div>
        <div>
          <div>
            <img src={thumbnail}/>
          </div>
          <div>
            <p><span>조회수 :</span> <span>{viewer.formatNumber('#,###')} 회</span></p>
            <p><span>좋아요 :</span> <span>{likeCount.formatNumber('#,###')} 개</span></p>
            <p><span>댓글 :</span> <span>{commentCount.formatNumber('#,###')} 개</span></p>
          </div>
        </div>
      </div>
    `;

    // Drop-shaped tooltips
    if (series.tooltip) {
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 1;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('rgba(0,0,0,0.4)');
      series.tooltip.pointerOrientation = 'horizontal';
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
    }

    const bullet = series.bullets.push(new am4core.Image());
    bullet.href = 'data:image/png;base64,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';
    bullet.width = 30;
    bullet.height = 30;
    bullet.horizontalCenter = 'middle';
    bullet.verticalCenter = 'middle';
    const bullethover = bullet.states.create('hover');
    bullethover.properties.scale = 1.3;

    // 값에 따라 불렛에 다른 아이콘 적용
    // https:// www.amcharts.com/docs/v4/tutorials/using-adapters-for-value-sensitive-bullet-adjustments/
    bullet.adapter.add('href', (href, target) => {
      if (target.dataItem) {
        const { includePaidAd }: Record<string, any> = target.dataItem.dataContext;
        if (includePaidAd) {
          return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT17qz38aB9pQhgbjNqrluTHOGWAEoaXx3BQ&usqp=CAU';
        }
      }

      return href;
    });
    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'panXY';
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    chartRef.current = chart;
    return () => {
      chart.dispose();
    };
  },
  [data, category]);

  return (
    <>
      <div id={containerId} style={{ width: '100%', height: '450px' }} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
