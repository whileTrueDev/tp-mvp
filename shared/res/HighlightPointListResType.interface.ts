export interface HighlightPointListItem{
  creatorId: string,
  platform: string,
  userId: string,
  title: string,
  endDate: Date,
  nickname: string,
  logo?: string
}

export interface HighlightPointListResType{
  data: HighlightPointListItem[],
  totalCount: number,
  page: number,
  take: number,
  totalPage: number,
  hasMore: boolean
}
