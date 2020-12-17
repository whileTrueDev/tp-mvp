import React, { useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import am4langKoKr from '@amcharts/amcharts4/lang/ko_KR';
import { UserMetrics } from '../../../../interfaces/UserMetrics';

am4core.useTheme(am4themesAnimated);

function getAvgGroupByDate(datalist: UserMetrics[]) {
  const reduced = datalist
    .map((d) => ({ ...d, startedDate: d.startDate.toISOString().split('T')[0] }))
    .reduce((m: any, d) => {
      const n = m;
      const key = d.startedDate;
      if (!n[key]) {
        n[key] = { ...d, count: 1 };
        return m;
      }
      if (d) {
        n[key].airTime += d.airTime;
        n[key].fan += d.fan;
        n[key].chatCount += d.chatCount;
        n[key].viewer += d.viewer;
        n[key].count += 1;
      }
      return m;
    },
    {});
  // Create new array from grouped data and compute the average
  const result = Object.keys(reduced).map((k) => {
    const item = reduced[k];
    return {
      ...item,
      airTime: item.airTime / item.count,
      fan: item.fan / item.count,
      chatCount: item.chatCount / item.count,
      viewer: item.viewer / item.count,
    };
  });
  return result;
}
export interface UserMetricsChartProps {
  data: UserMetrics[];
  selectedPlatform: string[];
  valueField?: string;
}
export default function UserMetricsChart({
  data,
  selectedPlatform,
  valueField = 'viewer',
}: UserMetricsChartProps): JSX.Element {
  useLayoutEffect(() => {
    // **************************************
    // 단위 설정
    let unit = '명';
    switch (valueField) {
      case 'chatCount': unit = '개';
        break;
      case 'fan': unit = '명';
        break;
      case 'airTime': unit = '시간';
        break;
      case 'viewer':
      default: unit = '명';
        break;
    }

    const x = am4core.create('chartdiv', am4charts.XYChart);
    x.language.locale = am4langKoKr;
    x.paddingRight = 12;

    if (data) {
      x.data = data.filter((d) => selectedPlatform.includes(d.platform));

      const afreecaData = x.data
        .filter((d) => d.platform === 'afreeca')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const twitchData = x.data
        .filter((d) => d.platform === 'twitch')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const youtubeData = x.data
        .filter((d) => d.platform === 'youtube')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      const afreecaTrendData = getAvgGroupByDate(afreecaData);
      const twitchTrendData = getAvgGroupByDate(twitchData);
      const youtubeTrendData = getAvgGroupByDate(youtubeData);

      const dateAxis = x.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.opposite = true;
      // dateAxis.gridInterval = am4core.Inter
      dateAxis.tooltipDateFormat = 'yyyy년 MM월 dd일';
      dateAxis.dateFormats.setKey('day', 'MMMM dt');
      dateAxis.skipEmptyPeriods = true;

      const valueAxis = x.yAxes.push(new am4charts.ValueAxis());
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true;
      }
      valueAxis.renderer.minWidth = 35;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.renderer.axisFills.template.disabled = true;

      // ****************************************************
      // 아프리카 라인
      if (afreecaData.length > 0) {
        const afreecaLine = x.series.push(new am4charts.LineSeries());
        afreecaLine.data = afreecaData;
        afreecaLine.dataFields.dateX = 'startDate';
        afreecaLine.dataFields.valueY = valueField;
        afreecaLine.strokeOpacity = 0;
        if (afreecaLine.tooltip) {
          afreecaLine.tooltip.getStrokeFromObject = true;
          afreecaLine.tooltip.background.strokeWidth = 3;
        }

        const afreecaBullets = afreecaLine.bullets.push(new am4charts.Bullet());
        const afreecaDot = afreecaBullets.createChild(am4core.Circle);
        afreecaDot.horizontalCenter = 'middle';
        afreecaDot.verticalCenter = 'middle';
        afreecaDot.strokeWidth = 1;
        afreecaDot.fill = am4core.color('#1f66de');
        afreecaDot.stroke = am4core.color('#5f66de');
        afreecaDot.width = 12;
        afreecaDot.height = 12;
        afreecaDot.tooltipText = `{platform}\n{title}\n{dateX}, {valueY.value}${unit}`;
        const afreecaBulletsHover = afreecaBullets.states.create('hover');
        afreecaBulletsHover.properties.scale = 1.2;

        const afreecaTrendLine = x.series.push(new am4charts.LineSeries());
        afreecaTrendLine.data = afreecaTrendData;
        afreecaTrendLine.dataFields.dateX = 'startDate';
        afreecaTrendLine.dataFields.valueY = valueField;
        afreecaTrendLine.fill = am4core.color('#1f66de');
        afreecaTrendLine.strokeWidth = 10;
        afreecaTrendLine.strokeOpacity = 0.7;
        afreecaTrendLine.tensionY = 0.85;
        afreecaTrendLine.tensionX = 0.85;
      }

      // ****************************************************
      // 트위치 점
      if (twitchData.length > 0) {
        const twitchLine = x.series.push(new am4charts.LineSeries());
        twitchLine.data = twitchData;
        twitchLine.dataFields.dateX = 'startDate';
        twitchLine.dataFields.valueY = valueField;
        twitchLine.strokeOpacity = 0;
        if (twitchLine.tooltip) {
          twitchLine.tooltip.getStrokeFromObject = true;
          twitchLine.tooltip.background.strokeWidth = 3;
        }

        const twitchBullets = twitchLine.bullets.push(new am4charts.Bullet());
        const twitchDot = twitchBullets.createChild(am4core.Circle);
        twitchDot.horizontalCenter = 'middle';
        twitchDot.verticalCenter = 'middle';
        twitchDot.strokeWidth = 1;
        twitchDot.fill = am4core.color('#772CE8');
        twitchDot.stroke = am4core.color('#552CE8');
        twitchDot.width = 12;
        twitchDot.height = 12;
        twitchDot.tooltipText = `{platform}\n{title}\n{dateX}, {valueY.value}${unit}`;
        const twitchBulletsHover = twitchBullets.states.create('hover');
        twitchBulletsHover.properties.scale = 1.2;

        const twitchTrendLine = x.series.push(new am4charts.LineSeries());
        twitchTrendLine.data = twitchTrendData;
        twitchTrendLine.dataFields.dateX = 'startDate';
        twitchTrendLine.dataFields.valueY = valueField;
        twitchTrendLine.fill = am4core.color('#772CE8');
        twitchTrendLine.strokeWidth = 10;
        twitchTrendLine.strokeOpacity = 0.5;
        twitchTrendLine.tensionY = 0.85;
        twitchTrendLine.tensionX = 0.85;
      }

      // ****************************************************
      // 유튜브 점
      if (youtubeData.length > 0) {
        const youtubeLine = x.series.push(new am4charts.LineSeries());
        youtubeLine.data = youtubeData;
        youtubeLine.dataFields.dateX = 'startDate';
        youtubeLine.dataFields.valueY = valueField;
        youtubeLine.strokeOpacity = 0;
        if (youtubeLine.tooltip) {
          youtubeLine.tooltip.getStrokeFromObject = true;
          youtubeLine.tooltip.background.strokeWidth = 3;
        }

        const youtubeBullets = youtubeLine.bullets.push(new am4charts.Bullet());
        const youtubeDot = youtubeBullets.createChild(am4core.Circle);
        youtubeDot.horizontalCenter = 'middle';
        youtubeDot.verticalCenter = 'middle';
        youtubeDot.strokeWidth = 1;
        youtubeDot.fill = am4core.color('#CC0000');
        youtubeDot.stroke = am4core.color('#d81b60');
        youtubeDot.width = 12;
        youtubeDot.height = 12;
        youtubeDot.tooltipText = `{platform}\n{title}\n{dateX}, {valueY.value}${unit}`;
        const youtubeBulletsHover = youtubeBullets.states.create('hover');
        youtubeBulletsHover.properties.scale = 1.2;

        const youtubeTrendLine = x.series.push(new am4charts.LineSeries());
        youtubeTrendLine.data = youtubeTrendData;
        youtubeTrendLine.dataFields.dateX = 'startDate';
        youtubeTrendLine.dataFields.valueY = valueField;
        youtubeTrendLine.fill = am4core.color('#CC0000');
        youtubeTrendLine.stroke = am4core.color('#d81b60');
        youtubeTrendLine.strokeWidth = 10;
        youtubeTrendLine.strokeOpacity = 0.5;
        youtubeTrendLine.tensionY = 0.85;
        youtubeTrendLine.tensionX = 0.85;
      }

      x.cursor = new am4charts.XYCursor();
    }

    return () => {
      x.dispose();
    };
  }, [data, valueField, selectedPlatform]);

  return (
    <div id="chartdiv" style={{ width: '100%', height: '300px' }} />
  );
}
