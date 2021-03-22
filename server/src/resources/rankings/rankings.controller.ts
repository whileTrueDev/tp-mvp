import {
  Controller, Get,
} from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
  ) {}

  /**
   * 지난 월간 웃음/감탄/답답함점수 랭킹목록 반환 -> 지난 월간 웃음점수/감탄점수/답답함점수 막대그래프에 사용
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
   * 감탄점수, 웃음점수, 답답함점수, 욕점수 상위 10명과 
   * 10명의 최근 7개 방송 점수 데이터 반환
   * 
   * GET /rankings/top-ten
   * 
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
   * 플랫폼별 상위 10인 시청자수 합 비교 -> 플랫폼별 상위 10인의 시청자수 합 카드에 사용
   *
   * GET /rankings/daily-total-viewers
   * 
   * @return
   * {
   *  twitch: { data: [{maxViewer: number; creatorName: string; creatorId: string; }], total : number},
   *  afreeca: { data: [maxViewer: number; creatorName: string; creatorId: string; ], total: number}
   * }
   */
  @Get('daily-total-viewers')
  getDailyTotalViewers(): Promise<any> {
    return this.rankingsService.getDailyTotalViewers();
  }

  /**
   * 주간 시청자수 랭킹
   * GET /rankings/weekly-viewers
   * 최근 7일 내 날짜별 트위치,아프리카 시청자수 상위 10인의 시청자수 총합
   * @return 
   * {
   * afreeca: [{date:'2021-3-4',totalViewer:'23432'}, {date:'2021-3-3',totalViewer:'1235'}, ... ],
   * twitch: [{date:'2021-3-4',totalViewer:'1234'}, {date:'2021-3-3',totalViewer:'3432'}, ... ]
   * }
   */
  @Get('weekly-viewers')
  getWeeklyViewers(): Promise<any> {
    return this.rankingsService.getWeeklyViewers();
  }
}
