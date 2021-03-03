import { Controller, Get } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
  ) {}

  @Get()
  test(): Promise<any> {
    return this.rankingsService.test();
  }

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
  @Get('/monthly-scores')
  getMonthlyScores(): Promise<any> {
    return this.rankingsService.getMonthlyScores();
  }
}
