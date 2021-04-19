export interface RecentStream {
  streamId: string;
  title: string;
  startDate: string;
  viewer: number;
  likeCount: number;
  hateCount: number
}

export type RecentStreamResType = RecentStream[]
