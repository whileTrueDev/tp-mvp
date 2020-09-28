// 단순 선 그래프
import React, {
  useRef, useLayoutEffect
} from 'react';
import setLinearGraphComponent from './setLinearGraphComponent';
import { timelineGraphInterface } from './graphsInterface';

export default function TimeLineGraph({
  data, name, opposite, selectedMetric
} : {
  data : timelineGraphInterface[], selectedMetric: string[], name?: string, opposite?: number,
}): JSX.Element {
  const chartRef = useRef<any>(null);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setLinearGraphComponent(data, selectedMetric, name, opposite);
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [data, name, opposite, selectedMetric]);

  return (
    <div id={name || 'chartdiv'} style={{ width: '100%', height: '300px' }} />
  );
}
