  interface AdmireScore {
  admireScore: number
  }
  interface FrustrateScore {
  frustrateScore: number
  }
  interface CussScore {
  cussScore: number
  }
  interface SmileScore {
  smileScore: number
  }

export interface Scores extends Partial<AdmireScore>,
Partial<FrustrateScore>,
Partial<CussScore>,
Partial<SmileScore> {}
export interface TopTenDataItem extends Scores {
  id: number,
  creatorId: string,
  creatorName: string,
  title: string,
  platform: 'afreeca'|'twitch',
  twitchProfileImage: null | string,
  afreecaProfileImage: null | string,
  twitchChannelName: null | string,
}
  interface WeeklyTrendsItem extends Scores{
    createDate: string;
  }
export interface RankingDataType{
    rankingData: Array<TopTenDataItem>,
    weeklyTrends: {
      [key: string]: Array<WeeklyTrendsItem>
    }
  }
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
