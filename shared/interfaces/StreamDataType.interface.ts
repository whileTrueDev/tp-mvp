export interface StreamDataType{
  streamId: string;
  title: string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startDate: Date;
  endDate: Date;
  creatorId: string;
  smileCount: number;
  viewer: number;
  chatCount: number;
  needAnalysis: boolean;
}
