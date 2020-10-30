import { AxiosError } from 'axios';

export interface PeriodRequestArray {
  streams: {
    creatorId: string;
    streamId: string;
    startedAt: string;
  }[]
}
export interface PeriodAnalysisProps {
  loading: boolean;
  error: AxiosError<any> | undefined;
  handleSubmit: ({ category, params }: {
    category: string[];
    params: PeriodRequestArray;
  }) => void;
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
export interface DayStreamsInfo{
  streamId: string;
  startedAt: Date;
  creatorId: string;
  title: string;
  platform: 'afreeca'|'youtube'|'twitch';
  airTime: number;
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
