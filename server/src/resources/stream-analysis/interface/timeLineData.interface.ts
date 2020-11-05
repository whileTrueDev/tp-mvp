export interface TimeLineData {
  viewer: number;
  chatCount: number;
  smileCount: number;
  date: Date;
}

export interface Period {
  periodData: TimeLineData[];
}

export interface TimeLine {
  timeline: Period[];
}
