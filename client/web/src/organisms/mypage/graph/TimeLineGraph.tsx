import React, {
  useRef, useLayoutEffect,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { TimelineGraphInterface } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import setGraphComponent from './setTimeLineGraph';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';

export default function TimeLineGraph({ data, selectedMetric }: {
  data: TimelineGraphInterface[] | []; selectedMetric: string[];
}): JSX.Element {
  const theme = useTheme<TruepointTheme>();
  const chartRef = useRef<any>(null);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setGraphComponent(data, theme, selectedMetric);
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
