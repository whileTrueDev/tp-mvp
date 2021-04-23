import { VoteHistoryRes } from './VoteHistoryRes.interface';

export interface RecentStream {
  streamId: string;
  title: string;
  startDate: string;
  endDate: string;
  viewer: number;
  chatCount: number;
  likeCount?: number;
  hateCount?: number;
  voteHistory?: VoteHistoryRes;
}

export type RecentStreamResType = RecentStream[]
