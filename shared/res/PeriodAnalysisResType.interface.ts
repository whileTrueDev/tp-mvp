export interface PeriodAnalysisResType{
  start_date: string;
  end_date: string;
  view_count: number;
  chat_count: number;
  value:
    {
      chat_count: number;
      viewer?: number;
      smile_count: number;
      date: string;
    }[];
}
