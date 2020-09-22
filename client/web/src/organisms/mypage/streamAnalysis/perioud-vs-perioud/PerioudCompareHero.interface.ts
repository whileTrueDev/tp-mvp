export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
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
