/* Imports */
import React, { useLayoutEffect } from 'react';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import am4langKoKr from '@amcharts/amcharts4/lang/ko_KR';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import getPlatformColor from '../../../../utils/getPlatformColor';
import makeGroupedData from '../utils/makeGroupedData';

am4core.useTheme(am4themesAnimated);

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function UserMetricsChart({ data, selectedPlatform, valueField = 'viewer' }) {
  useLayoutEffect(() => {
    const chart = am4core.create('chartdiv', am4charts.XYChart);

    // some extra padding for range labels
    chart.paddingBottom = 50;

    chart.cursor = new am4charts.XYCursor();
    chart.language.locale = am4langKoKr;

    // will use this to store colors of the same items

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataItems.template.text = '';
    categoryAxis.adapter.add('tooltipText', () => `${new Date(categoryAxis.tooltipDataItem.dataContext.startedAt).toLocaleDateString()}
    ${new Date(categoryAxis.tooltipDataItem.dataContext.startedAt).toLocaleTimeString()}`);
    if (categoryAxis.tooltip) {
      categoryAxis.tooltip.background.opacity = 0.2;
    }

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if (valueAxis.tooltip) {
      valueAxis.tooltip.disabled = true;
    }
    valueAxis.min = 0;

    function createLineSeries(field, color) {
      const lineSeries = chart.series.push(new am4charts.LineSeries());
      // lineSeries.name = field;
      lineSeries.tooltipText = `${capitalize(field)}: {valueY}명[/]
      {realName}
      {title}
      `;
      lineSeries.tooltip.background.zIndex = 1;
      lineSeries.dataFields.categoryX = 'category';
      lineSeries.dataFields.valueY = field;
      lineSeries.bullets.push(new am4charts.CircleBullet());
      lineSeries.fill = am4core.color(color);
      lineSeries.stroke = am4core.color(color);
      lineSeries.strokeWidth = 2;
      lineSeries.snapTooltip = true;
      lineSeries.tensionX = 0.8;

      // when data validated, adjust location of data item based on count
      // lineSeries.events.on('datavalidated', () => {
      //   lineSeries.dataItems.each((dataItem) => {
      //   // if count divides by two, location is 0 (on the grid)
      //     if (dataItem.dataContext.count === 1) {
      //       dataItem.setLocation('categoryX', 1);
      //     } else {
      //       // otherwise location is 0.5 (middle)
      //       dataItem.setLocation('categoryX', 0.5);
      //     }
      //   });
      // });

      return lineSeries;
    }
    selectedPlatform.forEach((x) => {
      createLineSeries(x, getPlatformColor(x));
    });

    const rangeTemplate = categoryAxis.axisRanges.template;
    rangeTemplate.tick.disabled = false;
    rangeTemplate.tick.location = 0;
    rangeTemplate.tick.strokeOpacity = 0.6;
    rangeTemplate.tick.length = 40;
    rangeTemplate.grid.strokeOpacity = 0.5;
    rangeTemplate.label.tooltip = new am4core.Tooltip();
    rangeTemplate.label.tooltip.dy = -10;
    rangeTemplate.label.cloneTooltip = false;

    /// // DATA
    const chartData = [];

    const generatedGroupByData = makeGroupedData(data, valueField);

    console.log('generatedGroupByData', generatedGroupByData);

    // process data ant prepare it for the chart
    Object.keys(generatedGroupByData).forEach((date) => {
      const providerData = generatedGroupByData[date];

      // add data of one provider to temp array
      const tempArray = [];
      let count = 0;
      // add items
      Object.keys(providerData).forEach((itemName) => {
        // we generate unique category for each column
        // (providerName + "_" + itemName) and store realName
        if (providerData[itemName] instanceof Array) {
          providerData[itemName]
            .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
            .forEach((item, index) => {
              const alreadyPushedIndex = tempArray.findIndex((d) => date === d.date);
              if (alreadyPushedIndex > -1) {
              // 배열에 이미 동일한 날의 한개이상의 데이터가 있는 경우
                if (!tempArray[alreadyPushedIndex].youtube) {
                  tempArray[alreadyPushedIndex] = {
                    ...tempArray[alreadyPushedIndex],
                    [itemName]: item.value
                  };
                } else {
                  // 그 안에 해당 플랫폼 데이터가 있는 경우
                  tempArray.push({
                    category: `${date}_${index}`,
                    realName: new Date(item.startedAt).toLocaleTimeString(),
                    [itemName]: item.value,
                    date,
                    startedAt: item.startedAt
                  });
                }
              } else {
                tempArray.push({
                  category: `${date}_${index}`,
                  realName: new Date(item.startedAt).toLocaleTimeString(),
                  [itemName]: item.value,
                  date,
                  startedAt: item.startedAt
                });
              }
            });
        } else {
          const alreadyPushedIndex = tempArray.findIndex((d) => date === d.date);
          if (alreadyPushedIndex > -1) {
            // 배열에 이미 동일한 날의 한개이상의 데이터가 있는 경우
            tempArray[alreadyPushedIndex] = {
              ...tempArray[alreadyPushedIndex],
              [itemName]: providerData[itemName].value
            };
          } else {
            count += 1;
            tempArray.push({
              category: `${date}_${0}`,
              realName: new Date(providerData[itemName].startedAt).toLocaleTimeString(),
              [itemName]: providerData[itemName].value,
              date,
              startedAt: providerData[itemName].startedAt
            });
          }
        }
      });

      // add twitch and count to middle data item (line series uses it)
      const lineSeriesDataIndex = Math.floor(count / 2);
      tempArray[lineSeriesDataIndex].count = count;

      // push to the final data
      am4core.array.each(tempArray, (item) => {
        chartData.push(item);
      });

      // create range (the additional label at the bottom)
      const range = categoryAxis.axisRanges.create();
      range.category = tempArray[0].category;
      range.endCategory = tempArray[tempArray.length - 1].category;
      range.label.text = tempArray[0].date;
      // range.label.dy = 30;
      range.label.truncate = true;
      range.label.fontWeight = 'bold';
      range.label.tooltipText = tempArray[0].date;

      range.label.adapter.add('maxWidth', (maxWidth, target) => {
        const targetRange = target.dataItem;
        const startPosition = categoryAxis.categoryToPosition(targetRange.category, 0);
        const endPosition = categoryAxis.categoryToPosition(targetRange.endCategory, 1);
        const startX = categoryAxis.positionToCoordinate(startPosition);
        const endX = categoryAxis.positionToCoordinate(endPosition);
        return endX - startX;
      });
    });

    chart.data = chartData.sort((a, b) => b.startedAt - a.startedAt);

    // last tick
    const range = categoryAxis.axisRanges.create();
    range.category = chart.data[chart.data.length - 1].category;
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;

    return () => { chart.dispose(); };
  }, [data, valueField, selectedPlatform]);

  return (
    <div id="chartdiv" style={{ width: '100%', height: '300px' }} />
  );
}