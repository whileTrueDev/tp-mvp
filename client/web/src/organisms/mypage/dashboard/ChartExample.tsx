import React, { useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4langKoKr from '@amcharts/amcharts4/lang/ko_KR';
import useAxios from 'axios-hooks';
import { UserMetrics } from '../../../interfaces/UserMetrics';

am4core.useTheme(am4themes_animated);

function getAvgGroupByDate(datalist: UserMetrics[]) {
  const reduced = datalist
    .map((d) => ({ ...d, startedDate: d.startedAt.split(' ')[0] }))
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
  const afreecaDataResult = Object.keys(reduced).map((k) => {
    const item = reduced[k];
    return {
      ...item,
      airTime: item.airTime / item.count,
      fan: item.fan / item.count,
      chatCount: item.chatCount / item.count,
      viewer: item.viewer / item.count
    };
  });
  return afreecaDataResult;
}

export default function ChartExample(): JSX.Element {
  // Data fetching from backend
  const [{ data }] = useAxios<UserMetrics[]>({
    url: 'stream-analysis/user-statistics',
    method: 'GET',
    params: { userId: 'userId1' }
  });

  useLayoutEffect(() => {
    const x = am4core.create('chartdiv', am4charts.XYChart);

    x.language.locale = am4langKoKr;

    x.paddingRight = 15;

    if (data) {
      x.data = data;
      const afreecaData = data.filter((d) => d.platform === 'afreeca');
      const afreecaTrendData = getAvgGroupByDate(afreecaData);
      const twitchData = data.filter((d) => d.platform === 'twitch');
      const twitchTrendData = getAvgGroupByDate(twitchData);
      const youtubeData: UserMetrics[] = data.filter((d) => d.platform === 'youtube');
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
      // 아프리카 점
      const afreecaLine = x.series.push(new am4charts.LineSeries());
      afreecaLine.data = afreecaData;
      afreecaLine.dataFields.dateX = 'startedAt';
      afreecaLine.dataFields.valueY = 'viewer';
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
      afreecaDot.width = 15;
      afreecaDot.height = 15;
      afreecaDot.tooltipText = '{platform}\n{title}\n{dateX}, {valueY.value}명';
      const afreecaBulletsHover = afreecaBullets.states.create('hover');
      afreecaBulletsHover.properties.scale = 1.2;

      const afreecaTrendLine = x.series.push(new am4charts.LineSeries());
      afreecaTrendLine.data = afreecaTrendData;
      afreecaTrendLine.dataFields.dateX = 'startedAt';
      afreecaTrendLine.dataFields.valueY = 'viewer';
      afreecaTrendLine.fill = am4core.color('#1f66de');
      afreecaTrendLine.strokeWidth = 10;
      afreecaTrendLine.strokeOpacity = 0.7;

      // ****************************************************
      // 트위치 점
      const twitchLine = x.series.push(new am4charts.LineSeries());
      twitchLine.data = twitchData;
      twitchLine.dataFields.dateX = 'startedAt';
      twitchLine.dataFields.valueY = 'viewer';
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
      twitchDot.width = 15;
      twitchDot.height = 15;
      twitchDot.tooltipText = '{platform}\n{title}\n{dateX}, {valueY.value}명';
      const twitchBulletsHover = twitchBullets.states.create('hover');
      twitchBulletsHover.properties.scale = 1.2;

      const twitchTrendLine = x.series.push(new am4charts.LineSeries());
      twitchTrendLine.data = twitchTrendData;
      twitchTrendLine.dataFields.dateX = 'startedAt';
      twitchTrendLine.dataFields.valueY = 'viewer';
      twitchTrendLine.fill = am4core.color('#772CE8');
      twitchTrendLine.strokeWidth = 10;
      twitchTrendLine.strokeOpacity = 0.5;

      // ****************************************************
      // 유튜브 점
      const youtubeLine = x.series.push(new am4charts.LineSeries());
      youtubeLine.data = youtubeData;
      youtubeLine.dataFields.dateX = 'startedAt';
      youtubeLine.dataFields.valueY = 'viewer';
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
      youtubeDot.width = 15;
      youtubeDot.height = 15;
      youtubeDot.tooltipText = '{platform}\n{title}\n{dateX}, {valueY.value}명';
      const youtubeBulletsHover = youtubeBullets.states.create('hover');
      youtubeBulletsHover.properties.scale = 1.2;

      const youtubeTrendLine = x.series.push(new am4charts.LineSeries());
      youtubeTrendLine.data = youtubeTrendData;
      youtubeTrendLine.dataFields.dateX = 'startedAt';
      youtubeTrendLine.dataFields.valueY = 'viewer';
      youtubeTrendLine.fill = am4core.color('#CC0000');
      youtubeTrendLine.strokeWidth = 10;
      youtubeTrendLine.strokeOpacity = 0.5;

      x.cursor = new am4charts.XYCursor();
    }

    return () => { x.dispose(); };
  }, [data]);

  return (
    <div id="chartdiv" style={{ width: '100%', height: '300px' }} />
  );
}
