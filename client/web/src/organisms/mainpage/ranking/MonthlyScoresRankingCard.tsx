import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Typography, Divider } from '@material-ui/core';
import CenterLoading from '../../../atoms/Loading/CenterLoading';

interface MonthlyScoresItem{
  creatorName: string;
  creatorId: string;
  platform: string;
  avgScore: number;
}
interface MonthlyScoresData{
  smile: MonthlyScoresItem[],
  frustrate: MonthlyScoresItem[],
  admire: MonthlyScoresItem[],
}

function ScoresBarChart({
  title, data, loading, column,
}: {
  title: string,
  data: MonthlyScoresItem[],
  loading: boolean,
  column? : string
}) {
  const chartRef = useRef<{
    chart: Highcharts.Chart
    container: React.RefObject<HTMLDivElement>
  }>(null);

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
      marginTop: 24,
      events: {
        redraw(this: Highcharts.Chart) {
          // const { series, renderer, xAxis, plotTop } = this;
          // if (series[0].data.length === 0) return;
          // console.log('redraw', series[0].data);
        },
      },
    },
    title: { text: undefined },
    yAxis: {
      title: { text: undefined },
      labels: { enabled: false },
      max: 10,
      tickInterval: 1,
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: { enabled: false },
    series: [],
  });

  useEffect(() => {
    if (data.length === 0) return;
    const creatorNames = data.map((d) => d.creatorName);
    const scores = data.map((d) => d.avgScore);
    setChartOptions({
      xAxis: { categories: creatorNames },
      series: [{ type: 'column', name: `평균 ${column} 점수`, data: scores }],
    });
  }, [column, data]);

  return (
    <section>
      <Typography variant="h6">{title}</Typography>
      <Divider />

      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
      {loading && (
      <CenterLoading />
      )}

    </section>
  );
}

const useMonthlyScoresRankingStyle = makeStyles((theme: Theme) => createStyles({
  monthlyScores: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}));
function MonthlyScoresRankingCard(): JSX.Element {
  const classes = useMonthlyScoresRankingStyle();
  const monthlyScoresUrl = useRef<string>('/rankings/monthly-scores');
  const [{ data, loading }] = useAxios<MonthlyScoresData>(monthlyScoresUrl.current);

  return (
    <section className={classes.monthlyScores}>
      <ScoresBarChart
        title="지난 월간 웃음 점수 순위"
        data={data?.smile || []}
        loading={loading}
        column="웃음"
      />
    </section>
  );
}

export default MonthlyScoresRankingCard;
