export interface EachMetricData {
  title: string;
  tag: string;
  value: {
    category: string;
    broad1: number;
    broad2: number;
  }[];
  unit: string;
  broad1Count: number;
  broad2Count: number;
  diff: number;
}

export interface StreamAnalysisResType{
  calculatedData: EachMetricData[];
  streamTitles?: string[];
}
