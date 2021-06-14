// 폴라차트
export interface DailyTotalViewersItemData{
  maxViewer: number;
  creatorName: string;
  creatorId: string;
}

export interface DailyTotalViewersData{
  total: number;
  data: DailyTotalViewersItemData[];
}

export interface DailyTotalViewersResType{
  afreeca: DailyTotalViewersData,
  twitch: DailyTotalViewersData
}

// 주간시청자수 그래프
export interface WeeklyData{
  date: string;
  totalViewer: string;
}

// 탑텐
export interface Scores{
  admireScore?: number,
  frustrateScore?: number,
  cussScore?: number,
  smileScore?: number,
  viewer? : number,
  rating? : number,
}
export interface TopTenDataItem extends Scores{
  id: number,
  creatorId: string,
  creatorName: string,
  title?: string,
  platform: 'afreeca'|'twitch',
  twitchProfileImage?: string | null,
  afreecaProfileImage?: string | null,
  twitchChannelName?: string | null,
  averageRating?: number,
}
export interface WeeklyTrendsItem extends Scores{
    createDate: string,
    title?: string,
  }

export interface WeeklyTrendsType{
  [key: string]: Array<WeeklyTrendsItem>
}
export interface RankingDataType{
    rankingData: Array<TopTenDataItem>,
    weeklyTrends: WeeklyTrendsType,
    totalDataCount: number
  }
