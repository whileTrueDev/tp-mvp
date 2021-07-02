export interface Creator {
  'creatorId': string;
  'nickname': string;
  'logo': string;
  'categories': string[];
  'averageRating': number;
  'platform': string;
}

export interface CreatorListRes {
  data: Creator[],
  totalCount: number,
  page: number,
  totalPage: number,
  take: number,
  hasMore: boolean,
}
