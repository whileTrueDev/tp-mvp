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

// 월간 막대차트
export interface MonthlyScoresItem{
  creatorName: string;
  creatorId: string;
  platform: string;
  avgScore: number;
}
export interface MonthlyScoresResType{
  smile: MonthlyScoresItem[],
  frustrate: MonthlyScoresItem[],
  admire: MonthlyScoresItem[],
  cuss: MonthlyScoresItem[],
}

// 주간시청자수 그래프
export interface WeeklyData{
  date: string;
  totalViewer: string;
}
export interface WeeklyViewersResType{
  afreeca: WeeklyData[],
  twitch: WeeklyData[]
}

// 탑텐

export interface Scores{
  admireScore?: number,
  frustrateScore?: number,
  cussScore?: number,
  smileScore?: number,
  viewer? : number,
}
export interface TopTenDataItem extends Scores{
  id: number,
  creatorId: string,
  creatorName: string,
  title: string,
  platform: 'afreeca'|'twitch',
  twitchProfileImage?: string | null,
  afreecaProfileImage?: string | null,
  twitchChannelName?: string | null,
  averageRating?: number,
}
export interface WeeklyTrendsItem extends Scores{
    createDate: string,
  }

export interface WeeklyTrendsType{
  [key: string]: Array<WeeklyTrendsItem>
}
export interface RankingDataType{
    rankingData: Array<TopTenDataItem>,
    weeklyTrends: WeeklyTrendsType,
    totalDataCount: number
  }
