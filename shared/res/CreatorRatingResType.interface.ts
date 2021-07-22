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

// 방송인 감정점수&평점 과거 데이터 조회 결과타입
export interface ScoreHistoryData {
  date: string,
  title: string | null,
  viewer: number | null,
  smile: number | null,
  frustrate: number | null,
  admire: number | null,
  cuss: number | null,
  rating: number | null
}

export interface AverageRating {
  date: string,
  averageRating: number,
}
