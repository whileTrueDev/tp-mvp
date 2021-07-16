import useAxios from 'axios-hooks';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function TestScoreHistory({ creatorId }: {creatorId: string}): JSX.Element {
  // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: { text: undefined },
    xAxis: {
      type: 'category',
      tickInterval: 5,
    },
    plotOptions: {
      series: {
        connectNulls: true,
      },
    },
  });
  const [{ data }] = useAxios({
    url: '/rankings/test-score-history',
    method: 'get',
    params: {
      creatorId,
    },
  });
  useEffect(() => {
    viewerClick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const viewerClick = () => {
    if (!data) return;
    const viewerData = data.rankings.map(({ dt, avgViewer }: {dt: string, avgViewer: number}) => [dt, avgViewer]);
    setChartOptions({
      series: [
        {
          type: 'line',
          data: viewerData,
        },
      ],
    });
  };
  const smileClick = () => {
    if (!data) return;
    const smileData = data.rankings.map(({ dt, avgSmileScore }:
      {dt: string, avgSmileScore: number}) => [dt, avgSmileScore]);
    setChartOptions({
      series: [
        {
          type: 'line',
          data: smileData,
        },
      ],
    });
  };
  const ratingClick = () => {
    if (!data) return;

    const test = data.rankings.reduce((acc: any[], cur: { dt: any; }, index: number) => {
      const { dt } = cur;
      const ratingData = data.ratings.find(({ date }: {date: string}) => date === dt);
      if (ratingData) {
        return [...acc, [dt, ratingData.averageRating]];
      }
      if (index === 0) {
        return [...acc, [dt, null]];
      }
      const lastAvgRating = acc[acc.length - 1][1];
      return [...acc, [dt, lastAvgRating]];
    }, []);

    const firstRatingIndex = test.findIndex(([_, rating]: [string, number|null]) => rating);
    console.log({ firstRatingIndex });
    console.log(test.slice(firstRatingIndex));
    // 평점 매겨진 적이 없는 경우 문구 표시 필요 -> 

    setChartOptions({
      series: [
        {
          type: 'line',
          data: firstRatingIndex === -1 ? test : test.slice(firstRatingIndex),
        },
      ],
    });
  };
  return (
    <div>
      testhistory
      <button onClick={viewerClick}>시청자수</button>
      <button onClick={smileClick}>웃음</button>
      <button onClick={ratingClick}>평점</button>

      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
