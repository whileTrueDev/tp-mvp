export interface StreamAnalysisResType{
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
  broad1Title: string;
  broad2Title: string;
  sign: number;
  diff: string;
}
