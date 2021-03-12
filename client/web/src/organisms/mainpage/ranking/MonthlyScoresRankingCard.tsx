import React from 'react';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import ScoresBarChart from './sub/ScoresBarChart';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

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
  const { enqueueSnackbar } = useSnackbar();
  const classes = useMonthlyScoresRankingStyle();
  const [{ data, error, loading }] = useAxios<MonthlyScoresData>('/rankings/monthly-scores');

  if (error) {
    console.error(error);
    ShowSnack('월간 점수 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
  }
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
