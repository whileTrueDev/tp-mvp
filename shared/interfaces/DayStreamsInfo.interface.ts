export interface DayStreamsInfo{
  streamId: string;
  title: string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
  creatorId: string;
  chatCount: number;
  smileCount: number;
  viewer: number;
}
