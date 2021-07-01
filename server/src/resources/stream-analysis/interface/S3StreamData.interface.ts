export interface TimeLine{
  smile_count: number;
  chat_count: number;
  viewer_count: number;
}

export interface S3StreamData {
  start_date: string;
  end_date: string;
  time_line: TimeLine[];
  total_index: number;
}
