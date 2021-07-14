export interface PeriodAnalysisResType{
  start_date: string;
  end_date: string;
  view_count: number;
  chat_count: number;
  value: TimelineGraphInterface[];
}

export interface TimelineGraphInterface {
  smile_count: number;
  chat_count: number;
  viewer_count: number;
  date: string;
}
