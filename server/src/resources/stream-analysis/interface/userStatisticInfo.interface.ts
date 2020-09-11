export interface UserStatisticsInterface {
  streamId: string;
  platform: string;
  userId: string;
  creatorId: string;
  title: string;
  viewer: number;
  fan: number;
  startAt: Date;
  length: number;
  chatCount : number;
}
