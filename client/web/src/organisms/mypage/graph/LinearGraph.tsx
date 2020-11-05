// 단순 선 그래프
import React, {
  useRef, useLayoutEffect,
} from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import setLinearGraphComponent from './setLinearGraphComponent';
import { timelineGraphInterface } from './graphsInterface';

export default function TimeLineGraph({
  data, name, opposite, selectedMetric,
}: {
  data: timelineGraphInterface[]; selectedMetric: string[]; name?: string; opposite?: number;
}): JSX.Element {
  const chartRef = useRef<any>(null);

  const theme = useTheme();

  // console.log('DATA', data);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setLinearGraphComponent(
      data, selectedMetric, name, opposite, theme.palette.text.secondary,
    );
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [data, name, opposite, selectedMetric, theme.palette.text.secondary]);

  return (
    <div id={name || 'chartdiv'} style={{ width: '100%', height: '300px' }} />
  );
}
