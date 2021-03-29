import {
  Body, Controller, Delete, Get, Param, Post, ValidationPipe,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatingsService } from './creatorRatings.service';

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
    @RealIP() ip: string,
    @Body(ValidationPipe) ratingPostDto: RatingPostDto,
  ): Promise<any> {
    return this.ratingsService.createRatings(creatorId, ratingPostDto, 'test');
    // return this.ratingsService.createRatings(creatorId, ratingPostDto, ip);
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
    @RealIP() ip: string,
  ): Promise<any> {
    return this.ratingsService.deleteRatings(creatorId, ip);
  }

  /**
   * creatorId의 1달 내 평균평점과 평가횟수 조회
   * @param creatorId 
   * @returns 
   */
  @Get('/:creatorId')
  getRatings(
    @Param('creatorId') creatorId: string,
  ): Promise<any> {
    return this.ratingsService.getRatings(creatorId);
  }
}
