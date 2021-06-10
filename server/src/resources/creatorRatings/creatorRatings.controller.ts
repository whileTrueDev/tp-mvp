import {
  Body, Controller, DefaultValuePipe, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, Res, UseGuards, ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatingInfoRes, CreatorAverageRatings, WeeklyRatingRankingRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { RankingDataType } from '@truepoint/shared/res/RankingsResTypes.interface';
import { CreatorRatingsService } from './creatorRatings.service';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { PlatformType } from '../rankings/rankings.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

export type AdminRating = {
  createDate: string,
  creatorId: string,
  userIp: string,
  platform: 'twitch' | 'afreeca',
  rating: number,
  userId: 'truepointAdmin'
}
@Controller('ratings')
export class CreatorRatingsController {
  constructor(
    private readonly ratingsService: CreatorRatingsService,
  ) {}

  /**
   * 관리자페이지에서 방송인에게 평점 매기기 - 
   * 사용자가 늘어나기 전까지 임시로 관리자페이지에서 평점 매길 수 있도록 함
   */
  @Post('/admin')
  createRatingByAdmin(
    @Body() adminRating: AdminRating[],
  ): Promise<any> {
    return this.ratingsService.createRatingByAdmin(adminRating);
  }

  /**
   * 평점 생성 & 수정 라우터
   * 평점을 생성하거나, 이미 평점을 매긴 경우 평점값을 수정한다
   * POST /ratings/:creatorId
   * @param creatorId 
   * @param ip 
   * @param ratingPostDto {rating: number; userId?: string;}
   * @returns 
   */
  @Post('/:creatorId')
  @UseGuards(JwtAuthGuard)
  createRatings(
    @Param('creatorId') creatorId: string,
    @Ip() ip: string,
    @Body(ValidationPipe) ratingPostDto: RatingPostDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CreatorRatingsEntity> {
  // 로그인하여 userId를 보낸 경우
    return this.ratingsService.createRatings(creatorId, ratingPostDto, ip);
  }

  /**
   * 해당ip를 가진 사람이 creatorId에 매긴 평점 데이터를 삭제한다
   * @param creatorId 
   * @param ip 
   * @returns 
   */
  @Delete('/:creatorId')
  deleteRatings(
    @Param('creatorId') creatorId: string,
    @Ip() ip: string,
    @Body('userId') userId?: string,
  ): Promise<string> {
    return this.ratingsService.deleteRatings(creatorId, ip, userId);
  }

  /**
   * 방송인 프로필 페이지에서 필요한 평균 평점, 감정점수, 방송인 정보 가져온다
   * @param ip 
   * @param platform 
   * @param creatorId 
   * @returns 
   */
  @Get('info/:platform/:creatorId')
  getCreatorRatingInfo(
    @Ip() ip: string,
    @Param('platform') platform: 'afreeca'|'twitch',
    @Param('creatorId') creatorId: string,
  ): Promise<CreatorRatingInfoRes> {
    return this.ratingsService.getCreatorRatingInfo(ip, creatorId, platform);
  }

  /**
   * creatorId의 1달 내 평균평점과 평가횟수 조회
   * @param creatorId 
   * @returns 
   */
  @Get('/:creatorId/average')
  getAverageRatings(
    @Param('creatorId') creatorId: string,
  ): Promise<CreatorAverageRatings> {
    return this.ratingsService.getAverageRatings(creatorId);
  }

  /**
   * 7일간 플랫폼별 평균 평점 추이값 리턴
   * @returns 
   */
  @Get('/weekly-average')
  weeklyAverageRating(): Promise<{
    dates: string[],
    afreeca: number[],
    twitch: number[]
  }> {
    return this.ratingsService.weeklyAverageRating();
  }

  /**
   * 주간 평점별 상위 10인과 랭킹변동순위 리턴
   * @returns 
   */
  @Get('/weekly-ranking')
  getWeeklyRatingsRanking(): Promise<WeeklyRatingRankingRes> {
    return this.ratingsService.getWeeklyRatingsRanking();
  }

  @Get('/daily-ranking')
  getDailyRatingRankings(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
      @Query('categoryId', new DefaultValuePipe(1), ParseIntPipe) categoryId: number,
      @Query('platform', new DefaultValuePipe('all')) platform: PlatformType,
  ): Promise<RankingDataType> {
    return this.ratingsService.getDailyRatingRankings({
      skip,
      categoryId,
      platform,
    });
  }

  /**
   * userId로 매긴 평점과 크리에이터 목록 가져오기
   * @param userId 
   * @returns 
   */
  @Get('/mypage')
  getRatingListByUserId(
    @Query('userId') userId: string,
  ): Promise<any> {
    return this.ratingsService.findRatingListByUserId(userId);
  }

  /**
   * 해당ip를 가진 유저가 creatorId에 매긴 평점 조회
   * 
   * @param ip 
   * @param creatorId 
   * @returns 
   */
  @Get('/:creatorId')
  getOneRating(
    @Param('creatorId') creatorId: string,
    @Query('userId') userId: string,
  ): Promise<{score: number} | false> {
    return this.ratingsService.findOneRating({ creatorId, userId });
  }
}
