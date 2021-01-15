import React, { useRef, useLayoutEffect, memo } from 'react';
import { useTheme } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4pluginsWordCloud from '@amcharts/amcharts4/plugins/wordCloud';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

export interface Word extends Record<string, any>{
text: string;
value: number;
}

interface WordCloudProps<W> extends Record<string, any>{
  words: W[],
}

export default memo((props: WordCloudProps<Word>): JSX.Element => {
  const { words } = props;

  const chartRef = useRef<any>(null);

  const theme = useTheme();
  const darkBlueColor = useRef<string>(theme.palette.primary.dark);
  const lightBlueColor = useRef<string>(theme.palette.primary.light);

  useLayoutEffect(() => {
    const chart = am4core.create('chartdiv-word-cloud', am4pluginsWordCloud.WordCloud);
    const series = chart.series.push(new am4pluginsWordCloud.WordCloudSeries());
    series.dataFields.word = 'text';
    series.dataFields.value = 'value';
    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.angles = [0, 0, 0];
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.tooltipText = '{word}: {value}';
    series.fontFamily = 'Courier New';
    series.maxFontSize = am4core.percent(15);
    series.randomness = 0;
    series.heatRules.push({
      target: series.labels.template,
      property: 'fill',
      min: am4core.color(lightBlueColor.current),
      max: am4core.color(darkBlueColor.current),
      dataField: 'value',
    });

    // 로딩 표시 
    // ev.target.baseSprite.preloader가 undefined라고 에러남
    // ev.target.baseSpirte === chart

    // series.events.on('arrangestarted', (ev) => {
    //   ev.target.baseSprite.preloader.show(0);
    // });

    // series.events.on('arrangeprogress', (ev) => {
    //   ev.target.baseSprite.preloader.progress = ev.progress;
    // });

    series.data = words;

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [words]);

  return (
    <>
      <div id="chartdiv-word-cloud" style={{ width: '100%', height: '500px' }} />
      {!words.length && <div>데이터가 없습니다</div>}
    </>

  );
});
