import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
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
  dayStreamsList: (StreamDataType)[];
  baseStream: StreamDataType|null;
  compareStream: StreamDataType|null;
  handleSeletedStreams: (newStreams: StreamDataType|null, base?: true | undefined) => void;
  handleFullMessage: (isSelectedListFull: boolean) => void;
  platformIcon: (stream: StreamDataType) => JSX.Element;
}

export interface StreamCardProps {
  stream: StreamDataType | null;
  base? : true|null;
  platformIcon: (stream: StreamDataType) => JSX.Element;
  handleSeletedStreams: (newStreams: StreamDataType|null, base?: true | undefined) => void
}

export interface StreamCalendarProps {
  handleDayStreamList: (responseList: (StreamDataType)[]) => void;
  clickedDate: Date;
  baseStream: StreamDataType|null;
  compareStream: StreamDataType|null;
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
