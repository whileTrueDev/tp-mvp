/* Imports */
import React, { useLayoutEffect } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import PropTypes from 'prop-types';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import am4langKoKr from '@amcharts/amcharts4/lang/ko_KR';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import getPlatformColor from '../../../../utils/getPlatformColor';
import dateExpression from '../../../../utils/dateExpression';
import makeGroupedData from '../utils/makeGroupedData';

am4core.useTheme(am4themesAnimated);

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function UserMetricsChart({
  data, selectedPlatform, valueField = 'viewer', height = 400,
}) {
  // use material theme
  const theme = useTheme();

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

  useLayoutEffect(() => {
    // 차트
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.height = am4core.percent(100);
    chart.responsive.enabled = true;

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
    categoryAxis.adapter.add('tooltipText', () => dateExpression({
      compoName: 'metric-graph-tooltip',
      createdAt: categoryAxis.tooltipDataItem.dataContext.startDate,
    }));

    if (categoryAxis.tooltip) {
      categoryAxis.tooltip.background.opacity = 1;
    }
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if (valueAxis.tooltip) {
      valueAxis.tooltip.disabled = true;
    }
    // y축 최댓값 (1000 이 최대값이면 1100 까지 보여지도록)
    valueAxis.extraMax = 0.1;
    // 최소값 패딩 (최소값 패딩, 하지만 모든 데이터가 음수로 내려갈 일이 없으므로 그대로 둔다.)
    // valueAxios.extraMin = 0.05;

    function createLineSeries(field, color) {
      const lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = field;
      lineSeries.tooltipText = `${capitalize(field)}: {valueY}${unit}[/]\n{title}`;
      lineSeries.tooltip.background.zIndex = 1;
      lineSeries.dataFields.categoryX = 'category';
      lineSeries.dataFields.valueY = field;
      lineSeries.bullets.push(new am4charts.CircleBullet());
      lineSeries.fill = am4core.color(color);
      lineSeries.stroke = am4core.color(color);
      lineSeries.strokeWidth = 2;
      lineSeries.snapTooltip = true;
      lineSeries.tensionX = 0.9;
      lineSeries.tensionY = 0.9;

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

    /// // DATA
    const chartData = [];

    const generatedGroupByData = makeGroupedData(data, valueField);

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
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .forEach((item, index) => {
              const alreadyPushedIndex = tempArray.findIndex((d) => date === d.date);
              if (alreadyPushedIndex > -1) {
              // 배열에 이미 동일한 날의 한개이상의 데이터가 있는 경우
                if (!tempArray[alreadyPushedIndex][itemName]) {
                  tempArray[alreadyPushedIndex] = {
                    ...tempArray[alreadyPushedIndex],
                    realName: dateExpression({
                      compoName: 'metric-graph',
                      createdAt: item.startDate,
                    }),
                    [itemName]: item.value,
                    title: item.title,
                  };
                } else {
                  // 그 안에 해당 플랫폼 데이터가 있는 경우
                  tempArray.push({
                    category: `${date}_${index}`,
                    realName: dateExpression({
                      compoName: 'metric-graph',
                      createdAt: item.startDate,
                    }),
                    [itemName]: item.value,
                    title: item.title,
                    date,
                    startDate: item.startDate,
                  });
                }
              } else {
                tempArray.push({
                  category: `${date}_${index}`,
                  realName: dateExpression({
                    compoName: 'metric-graph',
                    createdAt: item.startDate,
                  }),
                  [itemName]: item.value,
                  title: item.title,
                  date,
                  startDate: item.startDate,
                });
              }
            });
        } else {
          const alreadyPushedIndex = tempArray.findIndex((d) => date === d.date);
          if (alreadyPushedIndex > -1) {
            // 배열에 이미 동일한 날의 한개이상의 데이터가 있는 경우
            tempArray[alreadyPushedIndex] = {
              ...tempArray[alreadyPushedIndex],
              [itemName]: providerData[itemName].value,
              title: providerData[itemName].title,
            };
          } else {
            count += 1;
            tempArray.push({
              category: `${date}_${0}`,
              realName: dateExpression({
                compoName: 'metric-graph',
                createdAt: providerData[itemName].startDate,
              }),
              [itemName]: providerData[itemName].value,
              title: providerData[itemName].title,
              date,
              startDate: providerData[itemName].startDate,
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

    chart.data = chartData
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // last tick
    const range = categoryAxis.axisRanges.create();
    if (chart.data[chart.data.length - 1]) {
      range.category = chart.data[chart.data.length - 1].category;
    }
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;

    categoryAxis.renderer.grid.template.stroke = am4core.color(theme.palette.text.secondary);
    valueAxis.renderer.grid.template.stroke = am4core.color(theme.palette.text.secondary);
    rangeTemplate.tick.stroke = am4core.color(theme.palette.text.secondary);
    range.tick.stroke = am4core.color(theme.palette.text.secondary);
    // 테마에 따라 글자색 변경 - x축
    categoryAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.primary);
    // 테마에 따라 글자색 변경 - y축
    valueAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.primary);

    return () => {
      chart.dispose();
    };
  }, [data, valueField, selectedPlatform, unit, theme]);

  return (
    <div id="chartdiv" style={{ width: '100%', height }} />
  );
}

UserMetricsChart.defaultProps = {
  height: 400,
};

UserMetricsChart.propTypes = {
  data: PropTypes.any,
  selectedPlatform: PropTypes.arrayOf(PropTypes.string),
  valueField: PropTypes.string,
  height: PropTypes.number,
};
