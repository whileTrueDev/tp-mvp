import React, {
  useRef, useLayoutEffect,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import setGraphComponent from './setTimeLineGraph';
// import { timelineGraphInterface } from './graphsInterface';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';

export default function TimeLineGraph({ data, selectedMetric }: {
  data: any[]; selectedMetric: string[];
}): JSX.Element {
  const theme = useTheme<TruepointTheme>();
  const chartRef = useRef<any>(null);

  /**
   *  평균 시청자 수 레이블 임시 주석
   *  S3 metrics json 타임라인에 viewr 프로퍼티 추가 되기 전까지
   */
  useLayoutEffect(() => {
    // Create chart instance
    const chart = setGraphComponent(data, theme);
    selectedMetric.forEach((element: string) => {
      switch (element) {
        case 'smile':
          chart.series.values[0].show();
          break;
        case 'chat':
          chart.series.values[1].show();
          break;
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
