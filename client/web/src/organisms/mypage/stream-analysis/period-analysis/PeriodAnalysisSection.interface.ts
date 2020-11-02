import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';

export interface FatalError {
  helperText: string;
  isError: boolean;
}

export interface SubmitInterface {
  category: string[];
  params: SearchEachS3StreamData[];
}
export interface PeriodAnalysisProps {
  loading: boolean;
  error: undefined | FatalError;
  handleSubmit: ({ category, params }: SubmitInterface
  ) => void;
}

export interface RangeSelectCaledarProps {
  period: Date[];
  handlePeriod: (startAt: Date, endAt: Date, base?: true) => void;
  base?: true;
  handleError: (newError: FatalError) => void;
}
export interface CombinedTimeLine {
  smileCount: number;
  chatCount: number;
  date: string;
}
export interface OrganizedData {
  avgViewer: number;
  avgChatCount: number;
  timeLine: CombinedTimeLine[];
}
export interface AnaysisStreamsInfo {
  avgViewer: number;
  avgChatCount: number;
  timeLine: CombinedTimeLine[];
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
