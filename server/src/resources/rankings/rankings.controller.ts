import {
  Controller, DefaultValuePipe, Get, ParseIntPipe, Query, ValidationPipe,
} from '@nestjs/common';
import {
  DailyTotalViewersResType, RankingDataType, FirstPlacesRes,
} from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { ColumnType, RankingsService, PlatformType } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
  ) {}

  /**
   * 반응별 랭킹 top 10
   * 반응 기준별로 감탄점수, 웃음점수, 답답함점수, 욕점수 상위 10명과 
   * 10명의 최근 7개 방송 점수 데이터 반환
   *
   * skip 파라미터는 skip개 이후 데이터를 가져오기 위해 사용
   * 
   * GET /rankings/top-ten?column=smile&skip=
   * @param column 'smile'| 'frustrate'| 'admire'| 'cuss' | 'viewer'
   * @param skip number  해당 개수만큼 데이터 이후의 데이터를 가져옴
   * @param categoryId 크리에이터 카테고리 필터  CreatorCategoryTest 테이블에 있는 값, 0인경우 전체카테고리 의미
   * @return
   * {rankingData : {
                     creatorId: string;
                     id: number;
                     platform: string;
                     creatorName: string;
                     title: string;
                     streamDate: Date;
                     averageRating?: number;
                     [key:ScoreColumn]: number;
                   }
      weeklyTrends : {[key:string] : [ { createDate: string; [key:ScoreColumn]: number }],
      totalDataCount: number
    }
   }
   */
  @Get('top-ten')
  getTopTenRank(
      @Query('column', new ValidationPipe()) column: ColumnType,
      @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
      @Query('categoryId', new DefaultValuePipe(0), ParseIntPipe) categoryId: number,
      @Query('platform', new DefaultValuePipe('all')) platform: PlatformType,
  ): Promise<RankingDataType> {
    // categoryId === 0 : 전체
    return this.rankingsService.getTopTenRank(column, skip, categoryId, platform);
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
  getDailyTotalViewers(): Promise<DailyTotalViewersResType> {
    return this.rankingsService.getDailyTotalViewers();
  }

  /**
   * 가장 최근 분석날짜와 시간( = max(createDate)) 반환 
   * @returns 가장최근 분석날짜 2021-03-15 00:09:34.358000 와 같이 반환
   */
  @Get('recent-analysis-date')
  getRecentAnalysisDate(): Promise<Date> {
    return this.rankingsService.getRecentAnalysysDate();
  }

  /**
   * 최고시청자수, 시청자 평점, 웃음점수, 욕점수 별 1위 방송인 정보 반환
   * @returns 
   */
  @Get('first-places-by-category')
  getFirstPlacesByCategory(): Promise<FirstPlacesRes> {
    return this.rankingsService.getFirstPlacesByCategory();
  }

  @Get('/scores/history')
  getTestScoreHistory(
    @Query('creatorId') creatorId: string,
    // @Query('startDate') startDate: Date, 조회 시작 날짜
  ): Promise<any> {
    return this.rankingsService.getScoresHistory(creatorId);
  }
}
