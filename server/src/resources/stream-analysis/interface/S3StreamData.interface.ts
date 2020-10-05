export interface TimeLine{
  smile_count: number;
  chat_count: number;
}

export interface S3StreamData {
  start_date: string;
  end_date: string;
  time_line: TimeLine[];
  total_index: number;
}

export interface CombinedTimeLine {
  smile_count : number;
  chat_count: number;
  date: string;
}

export interface OrganizedData {
  start_date: string;
  end_date: string;
  view_count: number;
  chat_count: number;
  value : CombinedTimeLine[];
}
