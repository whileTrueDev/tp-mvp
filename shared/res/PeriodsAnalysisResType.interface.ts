import { EachStream } from '../dto/stream-analysis/eachStream.dto';

export interface PeriodsAnalysisResType{
  timeline: EachStream[][],
  type: string| null,
  metrics: {
    title: string;
    tag: string;
    key: string;
    value: {
      category: string;
      broad1: number;
      broad2: number;
    }[];
    unit: string;
  }[]
}
