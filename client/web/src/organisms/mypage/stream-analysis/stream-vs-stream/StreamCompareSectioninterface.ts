import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';

export interface FatalError {
  helperText: string;
  isError: boolean;
}
export interface StreamCompareSectionPropInterface {
  handleSubmit: (params: SearchStreamInfoByStreamId) => void;
  loading: boolean;
  error: FatalError | undefined;
}

export interface StreamListProps {
  dayStreamsList: (DayStreamsInfo)[];
  baseStream: DayStreamsInfo|null;
  compareStream: DayStreamsInfo|null;
  handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void;
  handleFullMessage: (isSelectedListFull: boolean) => void;
  platformIcon: (stream: DayStreamsInfo) => JSX.Element;
}

export interface StreamCardProps {
  stream: DayStreamsInfo | null;
  base? : true|null;
  platformIcon: (stream: DayStreamsInfo) => JSX.Element;
  handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void
}

export interface StreamCalendarProps {
  handleDayStreamList: (responseList: (DayStreamsInfo)[]) => void;
  clickedDate: Date;
  baseStream: DayStreamsInfo|null;
  compareStream: DayStreamsInfo|null;
  setClickedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export interface RangeSelectCaledarProps {
  period: Date[];
  handleperiod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
}

export interface periodCompareTextBoxProps {
  base?: true;
  period: Date[];
  handleperiod: (startAt: Date, endAt: Date, base?: true) => void;
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
