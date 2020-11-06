export interface TimeLineData {
  viewer: number;
  chatCount: number;
  smileCount: number;
  startedAt: string;
}

export interface Period {
  periodData: TimeLineData[];
}

export interface TimeLine {
  timeline: Period[];
}
