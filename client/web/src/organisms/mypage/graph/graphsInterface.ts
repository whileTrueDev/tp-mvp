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
  diff: number;
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

export interface timelineInterface {
  start_date: string,
  end_date: string,
  view_count?: number,
  chat_count?: number,
  value: timelineGraphInterface[]
}
