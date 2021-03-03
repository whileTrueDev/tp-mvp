import { Controller, Get } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
  ) {}

  /**
   * 지난 월간 웃음/감탄/답답함점수 랭킹목록 반환
   * GET /rankings/monthly-scores
   * @return 
   * {
   * smile: MonthlyRankData[],
     frustrate: MonthlyRankData[],
     admire: MonthlyRankData[]
   * }
   */
  @Get('monthly-scores')
  getMonthlyScoresRank(): Promise<any> {
    return this.rankingsService.getMonthlyScoresRank();
  }

  /**
   * 반응별 랭킹 top 10
   * GET /rankings/top-ten
   * @return
   * {
    smile: TopTenRankData[],
    admire: TopTenRankData[],
    frustrate: TopTenRankData[],
    cuss: TopTenRankData[],
    }
   */
  @Get('top-ten')
  getTopTenRank(): Promise<any> {
    return this.rankingsService.getTopTenRank();
  }

  /**
   * 플랫폼별 상위 10인 시청자수 합 비교
   * GET /rankings/daily-total-viewers
   * @return
   * {
   *  twitch: { data: [], total : number},
   *  afreeca: { data: [], total: number}
   * }
   */
  @Get('daily-total-viewers')
  getDailyTotalViewers(): Promise<any> {
    return this.rankingsService.getDailyTotalViewers();
  }
}
