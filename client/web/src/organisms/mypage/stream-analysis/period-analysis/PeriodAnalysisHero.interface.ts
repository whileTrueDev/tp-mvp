export interface RangeSelectCaledarProps {
  period: Date[];
  handleperiod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
}

export interface DayStreamsInfo{
  streamId : string;
  startedAt: Date;
  creatorId: string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
}
export interface CombinedTimeLine {
  smileCount : number;
  chatCount: number;
  date: string;
}
export interface OrganizedData {
  category: 'viewer'|'chat'|'smile';
  avgViewer: number;
  avgChatCount: number;
  timeLine : CombinedTimeLine[];
}
export interface AnaysisStreamsInfo {
  avgViewer: number;
  avgChatCount: number;
  timeLine : CombinedTimeLine[];
}
export interface AnaysisStreamsInfoRequest {
  creatorId: string;
  streamId: string;
  startedAt: string;
}
export interface StreamListProps {
  termStreamsList: (DayStreamsInfo)[];
  handleRemoveIconButton: (removeStream: DayStreamsInfo) => void;
}

export interface CheckBoxGroupProps {
  handleCheckStateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  viewer: boolean;
  chat: boolean;
  smile: boolean;
}
