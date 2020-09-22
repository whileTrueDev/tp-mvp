import React, {
  useRef, useLayoutEffect
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import setGraphComponent from './setTimeLineGraph';
import { timelineGraphInterface } from './graphsInterface';

export default function TimeLineGraph({ data } : {
  data : timelineGraphInterface[]
}): JSX.Element {
  const theme = useTheme();
  const chartRef = useRef<any>(null);

  useLayoutEffect(() => {
    // Create chart instance
    const chart = setGraphComponent(data, theme);
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [data, theme]);

  const showGraph = (i : number) => {
    if (chartRef.current.series.values[i].isHidden) {
      chartRef.current.series.values[i].show();
    } else {
      chartRef.current.series.values[i].hide();
    }
  };

  return (
    <div>
      <button onClick={() => { showGraph(0); }}>웃음 발생 수</button>
      <button onClick={() => { showGraph(1); }}>채팅 발생 수</button>
      <div id="chartdiv" style={{ width: '100%', height: '400px' }} />
    </div>
  );
}
