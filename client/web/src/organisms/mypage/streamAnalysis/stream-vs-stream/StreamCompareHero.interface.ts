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
  platformIcon: (stream: DayStreamsInfo) => JSX.Element;
}

export interface StreamCardProps {
  stream: DayStreamsInfo;
  base? : true|null;
  platformIcon: (stream: DayStreamsInfo) => JSX.Element;
  handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void
}

export interface StreamCalendarProps {
  handleDayStreamList:(responseList: (DayStreamsInfo)[]) => void;
  clickedDate: Date;
  baseStream: DayStreamsInfo|null;
  compareStream: DayStreamsInfo|null;
  setClickedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export interface RangeSelectCaledarProps {
  perioud: Date[];
  handlePerioud: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
}

export interface PerioudCompareTextBoxProps {
  base?: true;
  perioud: Date[];
  handlePerioud: (startAt: Date, endAt: Date, base?: true) => void;
}

export interface CheckBoxGroupProps {
  handleCheckStateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  viewer: boolean;
  chatCount: boolean;
  smileCount: boolean;
}

export interface ISODateTextFieldError {
  helperText: string;
  isError: boolean;
}
