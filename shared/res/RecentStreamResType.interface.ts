import { VoteHistoryRes } from './VoteHistoryRes.interface';

interface Score {
  smile: number;
  frustrate: number;
  admire: number;
  cuss: number;
}

export interface RecentStream {
  streamId: string;
  title: string;
  startDate: string;
  endDate: string;
  viewer: number;
  chatCount: number;
  scores: Score;
  likeCount?: number;
  hateCount?: number;
  voteHistory?: VoteHistoryRes;
}

export type RecentStreamResType = RecentStream[]
