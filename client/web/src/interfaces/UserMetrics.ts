export interface UserMetrics {
  streamId: string;

  platform: string;

  userId: string;

  creatorId: string;

  title: string;

  viewer: number;
  fan: number;
  startDate: Date;
  endDate: Date;
  airTime: number;
  chatCount: number;
  needAnalysis: boolean;
}
