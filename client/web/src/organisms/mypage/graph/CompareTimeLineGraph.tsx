import React, {
  useRef, useLayoutEffect,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import setCompareTimeLineGraph from './setCompareTimeLineGraph';
// import { timelineGraphInterface } from './graphsInterface';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';

export default function CompareTimeLineGraph({ data, selectedMetric }: {
  data: any[]; selectedMetric: string[];
}): JSX.Element {
  const theme = useTheme<TruepointTheme>();
  const chartRef = useRef<any>(null);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setCompareTimeLineGraph(data, theme);
    selectedMetric.forEach((element: string) => {
      switch (element) {
        case 'base':
          chart.series.values[0].show();
          break;
        case 'compare':
          chart.series.values[1].show();
          break;
        default:
          break;
      }
    });
    chartRef.current = chart;
    return () => {
      chart.dispose();
    };
  }, [data, theme, selectedMetric]);

  return (
    <div>
      <div id="chartdiv" style={{ width: '100%', height: '400px' }} />
    </div>
  );
}
