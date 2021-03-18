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
