import { lighten } from '@material-ui/core/styles/colorManipulator';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { MonthlyScoresResType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import getPlatformColor from '../../../utils/getPlatformColor';
import { useMonthlyScoresRankingStyle } from './style/ScoresBarChart.style';
import ScoresVerticalBarChart from './sub/ScoresVerticalBarChart';

interface BarChartData{
  key: keyof MonthlyScoresResType,
  column: string,
  barColor: string,
  icon? : string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined
}
const barChartData: BarChartData[] = [
  {
    key: 'smile', column: '웃음', icon: <SentimentSatisfiedAltIcon />, barColor: lighten(getPlatformColor('afreeca'), 0.9),
  },
  {
    key: 'admire', column: '감탄', icon: <SentimentVerySatisfiedIcon />, barColor: 'rgb(213, 245, 231)',
  },
  {
    key: 'frustrate', column: '답답함', icon: <SentimentDissatisfiedIcon />, barColor: lighten(getPlatformColor('twitch'), 0.9),
  },
  {
    key: 'cuss', column: '욕', icon: <SentimentVeryDissatisfiedIcon />, barColor: lighten(getPlatformColor('afreeca'), 0.8),
  },
];
function MonthlyScoresRankingCard(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useMonthlyScoresRankingStyle();
  const [{ data, error, loading }] = useAxios<MonthlyScoresResType>('/rankings/monthly-scores');

  if (error) {
    console.error(error);
    ShowSnack('월간 점수 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
  }
  return (
    <section className={classes.monthlyScores}>
      {barChartData.map((bar) => {
        const {
          key, column, barColor, icon,
        } = bar;
        return (
          <ScoresVerticalBarChart
            key={key}
            data={data ? data[key] : []}
            column={column}
            barColor={barColor}
            loading={loading}
            icon={icon}
          />
        );
      })}
    </section>
  );
}

export default MonthlyScoresRankingCard;
