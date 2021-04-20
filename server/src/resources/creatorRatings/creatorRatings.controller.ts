import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, ValidationPipe, Query,
} from '@nestjs/common';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatingInfoRes, CreatorAverageRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { CreatorRatingsService } from './creatorRatings.service';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
@Controller('ratings')
export class CreatorRatingsController {
  constructor(
    private readonly ratingsService: CreatorRatingsService,
  ) {}

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
  createRatings(
    @Param('creatorId') creatorId: string,
    @Ip() ip: string,
    @Body(ValidationPipe) ratingPostDto: RatingPostDto,
  ): Promise<CreatorRatingsEntity> {
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
   * 주간 집계 시청자 평점 순위별 크리에이터 목록 반환
   * @param skip 
   * @param take 
   * @returns 
   */
  @Get('list')
  getListOrderByRatings(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<any> {
    return this.ratingsService.getListOrderByRatings(take, skip);
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
   * 해당ip를 가진 유저가 creatorId에 매긴 평점 조회
   * 
   * @param ip 
   * @param creatorId 
   * @returns 
   */
  @Get('/:creatorId')
  getOneRating(
    @Ip() ip: string,
    @Param('creatorId') creatorId: string,
  ): Promise<{score: number} | false> {
    return this.ratingsService.findOneRating(ip, creatorId);
  }
}
