import { MonthlyScoresItem } from '@truepoint/shared/dist/res/RankingsResTypes.interface';

export interface ScoresBarChartProps{
  data: MonthlyScoresItem[],
  loading?: boolean,
  column? : string,
  barColor? : string,
}
