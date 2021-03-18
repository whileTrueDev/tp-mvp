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
}
