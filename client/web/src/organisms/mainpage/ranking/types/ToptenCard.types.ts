import {
  RankingDataType, WeeklyTrendsItem, Scores, TopTenDataItem,
} from '@truepoint/shared/dist/res/RankingsResTypes.interface';

export interface TopTenListProps{
    currentTab: string, // 'smile'|'frustrate'|'cuss'|'admire',
    data: undefined | RankingDataType,
    loading?: boolean
  }

export interface TrendsBarChartProps{
  data: WeeklyTrendsItem[],
  currentScoreName: keyof Scores

}

export interface InfoComponentProps{
  data: TopTenDataItem,
  currentScoreName: keyof Scores

}
