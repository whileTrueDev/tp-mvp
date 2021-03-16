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
  platform: 'afreeca'|'twitch'
}
  interface WeeklyTrendsItem extends Scores{
    createDate: string;
  }
  interface RankingDataType{
    rankingData: Array<TopTenDataItem>,
    weeklyTrends: {
      [key: string]: Array<WeeklyTrendsItem>
    }
  }
export interface TopTenListProps{
    currentTab: string, // 'smile'|'frustrate'|'cuss'|'admire',
    data: RankingDataType,
    loading?: boolean
  }
