import React, {
  useRef, useLayoutEffect
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import setGraphComponent from './setTimeLineGraph';
import { timelineGraphInterface } from './graphsInterface';

export default function TimeLineGraph({ data, selectedMetric } : {
  data : timelineGraphInterface[], selectedMetric: string[]
}): JSX.Element {
  const theme = useTheme();
  const chartRef = useRef<any>(null);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setGraphComponent(data, theme);
    selectedMetric.forEach((element: string) => {
      switch (element) {
        case 'smile':
          chart.series.values[0].show();
          return;
        case 'chat':
          chart.series.values[1].show();
          return;
        case 'viewer':
          chart.series.values[2].show();
          break;
        default:
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
