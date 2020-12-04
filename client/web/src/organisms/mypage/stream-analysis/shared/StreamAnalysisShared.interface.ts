import { SvgIconProps } from '@material-ui/core';
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';

export interface FatalError {
  helperText: string;
  isError: boolean;
}

export interface StreamsListItem {
  streamId: string;
  startDate: Date;
  endDate: Date;
  creatorId: string;
  title: string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
  isRemoved: boolean;
  chatCount: number;
  smileCount: number;
  viewer: number;
}

export interface CalendarProps {
  period: Date[];
  // handlePeriod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
  handleSelectedDate: (newDate: Date) => void;
  currDate: Date;
  selectedStreams: StreamsListItem[];
}

export interface PeriodSelectBoxProps {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
  period: Date[];
  TitleIcon: (props: SvgIconProps) => JSX.Element;
  iconProps: any;
  titleMessage: string;
}

export interface RangeSelectCaledarProps {
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
  anchorEl: HTMLElement | null;
  handleAnchorOpenWithRef: (ref: React.MutableRefObject<HTMLDivElement | null>) => void;
  handleAnchorClose: () => void;
}

export interface PeriodStreamsListProps {
  selectedStreams: (StreamsListItem)[];
  handleStreamList: (targetItem: StreamsListItem, isRemoved?: boolean | undefined) => void
  selectedDate?: Date;
  small?: boolean
}
export interface CheckBoxGroupProps {
  handleCheckStateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  viewer: boolean;
  chat: boolean;
  smile: boolean;
}

export interface PeriodSelectPopperProps {
  anchorEl: HTMLElement;
  period: Date[];
  base?: true;
  selectedStreams: StreamsListItem[];
  handleAnchorClose: () => void;
  handleStreamList: (targetItem: StreamsListItem, isRemoved?: boolean | undefined) => void
}

export interface PeriodCompareSubmitInterface {
  category: string[];
  params: any;
}

export interface PeriodAnalysisSubmitInterface {
  category: string[];
  params: SearchEachS3StreamData[];
}

export interface PeriodCompareProps {
  loading: boolean;
  error: FatalError | undefined;
  handleSubmit: ({ category, params }: PeriodCompareSubmitInterface
  ) => void
}

export interface PeriodAnalysisProps {
  loading: boolean;
  error: undefined | FatalError;
  handleSubmit: ({ category, params }: PeriodAnalysisSubmitInterface
  ) => void;
}
