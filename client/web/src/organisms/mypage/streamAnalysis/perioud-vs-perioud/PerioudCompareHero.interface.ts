export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

export interface PerioudCompareCalendarProps {
  handlePerioud: (startAt: Date, endAt: Date) => void;
}
