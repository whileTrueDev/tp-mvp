import { AxiosError } from 'axios';

export interface DayStreamsInfo{
  streamId : string;
  title : string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  startedAt: Date;
}
export interface RangeSelectCaledarProps {
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
}
export interface periodCompareTextBoxProps {
  base?: true;
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true) => void;
}

export interface CheckBoxGroupProps {
  handleCheckStateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  viewer: boolean;
  chat: boolean;
  smile: boolean;
}
export interface ISODateTextFieldError {
  helperText: string;
  isError: boolean;
}

export interface PeriodsRequestParams {
  userId: string;
  baseStartAt: string;
  baseEndAt: string;
  compareStartAt: string;
  compareEndAt: string;
}

export interface PeriodCompareProps {
  loading: boolean;
  error : AxiosError<any> | undefined;
  handleSubmit : ({ category, params }: {
    category: string[];
    params: PeriodsRequestParams;
  }) => void
}
