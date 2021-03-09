import React, { useRef } from 'react';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import ScoresBarChart from './sub/ScoresBarChart';

export interface MonthlyScoresItem{
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

const useMonthlyScoresRankingStyle = makeStyles((theme: Theme) => createStyles({
  monthlyScores: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
}));
function MonthlyScoresRankingCard(): JSX.Element {
  const classes = useMonthlyScoresRankingStyle();
  const monthlyScoresUrl = useRef<string>('/rankings/monthly-scores');
  const [{ data, loading }] = useAxios<MonthlyScoresData>(monthlyScoresUrl.current);

  return (
    <section className={classes.monthlyScores}>
      <ScoresBarChart
        data={data?.smile || []}
        loading={loading}
        column="웃음"
        barColor="rgba(202, 186, 219,0.7)"
      />
      <ScoresBarChart
        data={data?.admire || []}
        loading={loading}
        column="감탄"
        barColor="rgba(162, 221, 195, 0.698)"
      />
      <ScoresBarChart
        data={data?.frustrate || []}
        loading={loading}
        column="답답함"
        barColor="rgba(229, 160, 206, 0.726)"
      />
    </section>
  );
}

export default MonthlyScoresRankingCard;
