import React, { useRef, useLayoutEffect, memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import {
  useTheme, makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
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
  useLoadingIndicator? : boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  noDataTextContainer: {
    padding: theme.spacing(10),
  },
}));

export default memo((props: WordCloudProps<Word>): JSX.Element => {
  const { words, useLoadingIndicator } = props;
  const classes = useStyles();

  const chartRef = useRef<any>(null);

  const theme = useTheme();
  const darkBlueColor = useRef<string>(theme.palette.primary.dark);
  const lightBlueColor = useRef<string>(theme.palette.primary.light);

  useLayoutEffect(() => {
    const chart = am4core.create('chartdiv-word-cloud', am4pluginsWordCloud.WordCloud);
    const series = chart.series.push(new am4pluginsWordCloud.WordCloudSeries());
    series.dataFields.word = 'text';
    series.dataFields.value = 'value';
    series.angles = [0, 0, 0];
    series.maxCount = 100;
    series.minWordLength = 2;
    // series.labels.template.margin(5, 5, 5, 5);
    series.labels.template.tooltipText = '{word}: {value}';
    series.fontFamily = 'Courier New';
    series.maxFontSize = am4core.percent(15);
    series.heatRules.push({
      target: series.labels.template,
      property: 'fill',
      min: am4core.color(lightBlueColor.current),
      max: am4core.color(darkBlueColor.current),
      dataField: 'value',
    });

    // ev.target(chart) 에 preloader가 null이라고 오류가 뜸
    if (useLoadingIndicator && words.length) {
      series.events.on('arrangestarted', (ev) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ev.target.preloader!.show(0);
      });
      series.events.on('arrangeprogress', (ev) => {
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-non-null-assertion
        ev.target.preloader!.progress = ev.progress;
      });
    }

    series.data = words;

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [words, useLoadingIndicator]);

  return (
    <>
      <div
        id="chartdiv-word-cloud"
        style={{
          width: '100%',
          height: words.length ? '500px' : '0px',
        }}
      />
      {words.length < 1 && (
        <Grid
          className={classes.noDataTextContainer}
          container
          justify="center"
          alignItems="center"
        >
          <Typography>데이터가 없습니다</Typography>
        </Grid>
      )}

    </>
  );
});
