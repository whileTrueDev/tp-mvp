export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}

export interface StreamListProps {
  dayStreamsList: (DayStreamsInfo)[];
  baseStream: DayStreamsInfo|null;
  compareStream: DayStreamsInfo|null;
  handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void;
  handleFullMessage : (isSelectedListFull: boolean) => void;
}

export interface StreamCardProps {
  stream: DayStreamsInfo;
  base? : true|null;
  handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void
}

export interface StreamCalendarProps {
  handleDayStreamList:(responseList: (DayStreamsInfo)[]) => void;
  clickedDate: Date;
  baseStream: DayStreamsInfo|null;
  compareStream: DayStreamsInfo|null;
  setClickedDate: React.Dispatch<React.SetStateAction<Date>>;
}
