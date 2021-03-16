interface AdmireTopTenDataItem{
  admireScore: number;
  }
  interface FrustrateTopTenDataItem{
  frustrateScore: number;
  }
  interface CussTopTenDataItem{
  cussScore: number;
  }
  interface SmileTopTenDataItem{
  smileScore: number;
  }
  interface TopTenDataItem extends Partial<AdmireTopTenDataItem>,
  Partial<CussTopTenDataItem>,
  Partial<FrustrateTopTenDataItem>,
  Partial<SmileTopTenDataItem> {
    id: number,
    creatorId: string,
    creatorName: string,
    title: string,
    platform: 'afreeca'|'twitch'
  }
  interface AdmireScoreItem {
  admireScore: number
  }
  interface FrustrateScoreItem {
  frustrateScore: number
  }
  interface CussScoreItem {
  cussScore: number
  }
  interface SmileScoreItem {
  smileScore: number
  }

  interface WeeklyTrendsItem extends Partial<AdmireScoreItem>,
  Partial<FrustrateScoreItem>,
  Partial<CussScoreItem>,
  Partial<SmileScoreItem>{
    createDate: string;
  }
  interface RankingDataType{
    rankingData: Array<TopTenDataItem>,
    weeklyTrends: {
      [key: string]: Array<WeeklyTrendsItem>
    }
  }
export interface TopTenListProps{
    data: RankingDataType
  }
