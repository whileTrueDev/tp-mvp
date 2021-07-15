import useAxios from 'axios-hooks';
import React, { useMemo } from 'react';

export default function TestScoreHistory(): JSX.Element {
  const [{ data }] = useAxios('/rankings/test-score-history');
  const dataArr = useMemo(() => {
    if (!data) {
      return {
        date: [],
        viewer: [],
      };
    }
    return {
      date: data.map((d: {date: string}) => d.date),
      viewer: data.map((d: {avgViewer: number}) => d.avgViewer),
    };
  }, [data]);
  return (
    <div>
      testhistory
      {data && JSON.stringify(dataArr, null, 2)}
    </div>
  );
}
