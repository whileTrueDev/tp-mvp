import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';

export interface FatalError {
  helperText: string;
  isError: boolean;
}
export interface RangeSelectCaledarProps {
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true, calendar?: true) => void;
  handleError: (newError: FatalError) => void;
  base?: true;
}
export interface periodCompareTextBoxProps {
  base?: true;
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true, calendar?: true) => void;
}
export interface PeriodCompareCalendarAndTextfieldProps{
  base?: true;
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true, calendar?: true) => void;
  handleError: (newError: FatalError) => void;
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

export interface SubmitInterface {
  category: string[];
  params: SearchStreamInfoByPeriods;
}

export interface PeriodCompareProps {
  loading: boolean;
  error: FatalError | undefined;
  handleSubmit: ({ category, params }: SubmitInterface
  ) => void
}
