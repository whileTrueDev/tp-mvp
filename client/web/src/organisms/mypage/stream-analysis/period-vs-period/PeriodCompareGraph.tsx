import React from 'react';
import {
  Grid, Typography, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import { EachStream } from '@truepoint/shared/dist/dto/stream-analysis/eachStream.dto';

import SectionTitle from '../../../shared/sub/SectionTitles';
import StreamMetrics from '../StreamMetrics';
import CompareTimeLineGraph from '../../graph/CompareTimeLineGraph';
import { CompareMetric } from '../shared/StreamAnalysisShared.interface';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  buttonWraper: {
    display: 'inline-flex', flexDirection: 'row', alignItems: 'center', height: 80,
  },
  selectedCategoryButton: {
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.primary.main,
  },
  categoryButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '&:hover': {
      transform: 'scale(1.04)',
      boxShadow: theme.shadows[5],
    },
  },
  selectedButtonTitle: {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
}));

export interface PeriodCompareGraphProps {
  handleSelectCompareMetric: (newMetric: CompareMetric) => void;
  selectedCompareMetric: CompareMetric;
  compareMetrics: CompareMetric[];
  timeLineData: EachStream[][];
  metricData: any;
  metricOpen: boolean;
  type: string;
}

export default function PeriodCompareGraph(props: PeriodCompareGraphProps): JSX.Element {
  const {
    handleSelectCompareMetric,
    selectedCompareMetric,
    compareMetrics,
    timeLineData,
    metricData,
    metricOpen,
    type,
  } = props;
  const classes = useStyles();

  const makeCompareData = (originData: EachStream[][], metric: CompareMetric) => {
    const baseData = originData[0];
    const compareData = originData[1];

    const viewerTimeLine: {
      baseValue?: number;
      baseDate?: string;
      compareValue?: number;
      compareDate?: string;
    }[] = [];

    const chatCountTimeLine: {
      baseValue?: number;
      baseDate?: string;
      compareValue?: number;
      compareDate?: string;
    }[] = [];

    const smileCountTimeLine: {
      baseValue?: number;
      baseDate?: string;
      compareValue?: number;
      compareDate?: string;
    }[] = [];

    baseData.forEach((eachBase) => {
      viewerTimeLine.push({
        baseValue: eachBase.viewer,
        baseDate: eachBase.startDate,
      });
      chatCountTimeLine.push({
        baseValue: eachBase.chatCount,
        baseDate: eachBase.startDate,
      });
      smileCountTimeLine.push({
        baseValue: eachBase.smileCount,
        baseDate: eachBase.startDate,
      });
    });

    compareData.forEach((eachCompare) => {
      viewerTimeLine.push({
        compareValue: eachCompare.viewer,
        compareDate: eachCompare.startDate,
      });
      chatCountTimeLine.push({
        compareValue: eachCompare.chatCount,
        compareDate: eachCompare.startDate,
      });
      smileCountTimeLine.push({
        compareValue: eachCompare.smileCount,
        compareDate: eachCompare.startDate,
      });
    });

    const result = {
      viewer: viewerTimeLine,
      chatCount: chatCountTimeLine,
      smileCount: smileCountTimeLine,
    };

    return result[metric];
  };

  const compareMetricFormmater = (targetMetric: CompareMetric): string => {
    switch (targetMetric) {
      case 'viewer':
        return '시청자 수';
      case 'smileCount':
        return '웃음 발생수';
      case 'chatCount':
        return '채팅 발생수';
      default:
        return '';
    }
  };

  return (

    <Grid container direction="column" spacing={8} style={{ padding: 32 }}>
      <Grid item xs={12}>
        <SectionTitle mainTitle="기간 비교 분석 그래프" />
        <Typography variant="body2">선택한 기준 기간과 비교 기간의 분석 그래프입니다.</Typography>
      </Grid>
      <Grid item container direction="row">
        <Grid item xs={12}>
          <div className={classes.buttonWraper}>
            {compareMetrics.map((currMetric) => (
              <Button
                className={
                  currMetric === selectedCompareMetric
                    ? classes.selectedCategoryButton : classes.categoryButton
                }
                variant="contained"
                style={{ width: 150, marginLeft: 16, height: 60 }}
                onClick={() => handleSelectCompareMetric(currMetric)}
                key={shortid.generate()}
              >
                <Typography
                  className={currMetric === selectedCompareMetric
                    ? classes.selectedButtonTitle : undefined}
                >
                  {compareMetricFormmater(currMetric)}
                </Typography>
              </Button>
            ))}
          </div>
          {timeLineData && (
          <CompareTimeLineGraph
            selectedMetric={['base', 'compare']}
            data={makeCompareData(timeLineData, selectedCompareMetric)}
          />
          )}
        </Grid>
      </Grid>

      <Grid item container>
        {metricOpen && metricData && (
        <StreamMetrics
          open={metricOpen}
          metricData={metricData}
          type={type}
        />
        )}
      </Grid>
    </Grid>
  );
}
