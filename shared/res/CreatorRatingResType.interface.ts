export interface CreatorRatingCardInfo {
  platform: 'afreeca'|'twitch',
  creatorId: string,
  logo: string,
  nickname: string,
  twitchChannelName?: string|null,
}
export interface CreatorAverageRatings{
  average: number,
  count: number
}
export interface CreatorAverageScores{
  admire: number,
  smile: number,
  frustrate: number,
  cuss: number
}
export interface CreatorRatingInfoRes {
  info: CreatorRatingCardInfo,
  ratings: CreatorAverageRatings,
  scores: CreatorAverageScores,
}

export interface WeeklyRatingRankingItem{
  creatorId: string,
  platform: 'afreeca'|'twitch',
  rankChange: number,
  averageRating: number,
  nickname: string,
  logo: string,
}

export interface WeeklyRatingRankingRes {
  startDate: string;
  endDate: string;
  rankingList: WeeklyRatingRankingItem[];
}
