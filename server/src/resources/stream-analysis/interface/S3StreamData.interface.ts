import { Category } from '../dto/category.dto';

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
  smileCount : number;
  chatCount: number;
  date: string;
}

export interface OrganizedData {
  avgViewer: number;
  avgChatCount: number;
  timeLine : CombinedTimeLine[];
  category: Category;
}
