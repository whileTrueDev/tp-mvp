export interface RangeSelectCaledarProps {
  perioud: Date[];
  handlePerioud: (startAt: Date, endAt: Date, base?: true) => void;
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

export interface StreamListProps {
  termStreamsList: (DayStreamsInfo)[];
  handleRemoveIconButton: (removeStream: DayStreamsInfo) => void;
}

export interface CheckBoxGroupProps {
  handleCheckStateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  viewer: boolean;
  chatCount: boolean;
  smileCount: boolean;
}
