export interface metricGraphInterface {
  category: string;
  broad1: number;
  broad2: number;
}

export interface metricInterface {
  title: string;
  tag: string;
  unit: string;
  broad1Count: number;
  broad2Count: number;
  broad1Title?: string;
  broad2Title?: string;
  diff: string;
  sign: number;
  value: metricGraphInterface[]
}

export interface ViewerTimeLines {
  viewer: number;
  startDate: string;
}

export interface CompareTimeLines {
  viewers: ViewerTimeLines[][];
}

export interface timelineGraphInterface {
  smileCount: number,
  chatCount: number,
  viewer?: number,
  startDate: string,
}

export type CompareMetric = 'viewer'|'smileCount'|'chatCount';

export interface CompareGraphData {
  baseValue?: number;
  baseDate?: string;
  compareValue?: number;
  compareDate?: string;
  metricType: string;
}

export interface timelineInterface {
  start_date: string,
  end_date: string,
  view_count?: number,
  chat_count?: number,
  value: timelineGraphInterface[]
}

// {smile_count: 4565, chat_count: 21405, viewer_count: 16009, date: "2021-06-21 20"}
export interface timelineDataInterface {
  smile_count: number,
  chat_count: number,
  viewer_count: number,
  date: string,
}
