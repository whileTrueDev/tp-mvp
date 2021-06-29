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

export interface CreatorAverageScoresWithRank{
  admire: number,
  smile: number,
  frustrate: number,
  cuss: number,
  total: number,
  admireRank: number,
  smileRank: number,
  frustrateRank: number,
  cussRank: number,
}
export interface CreatorRatingInfoRes {
  ratings: CreatorAverageRatings,
  scores: CreatorAverageScores | CreatorAverageScoresWithRank,
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
