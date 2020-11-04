export interface PeriodsAnalysisResType{
  timeline: {
    viewer: number;
    chatCount: number;
    smileCount: number;
    date: string;
  }[],
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
