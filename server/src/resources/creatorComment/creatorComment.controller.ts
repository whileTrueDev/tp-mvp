import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CheckPasswordDto } from '@truepoint/shared/dist/dto/creatorComment/checkPassword.dto';
import { ICreatorCommentsRes, IGetHates, IGetLikes } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentLikeService } from './creatorCommentLike.service';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { CreatorCommentHatesEntity } from './entities/creatorCommentHates.entity';
import { CreatorCommentLikesEntity } from './entities/creatorCommentLikes.entity';
@Controller('creatorComment')
export class CreatorCommentController {
  constructor(
    private readonly creatorCommentService: CreatorCommentService,
    private readonly creatorCommentLikeService: CreatorCommentLikeService,
  ) {}

  /**
   * 방송인 평가 댓글 작성
   * POST /creatorComment/:creatorId
   * @param creatorId 
   * @param createCommentDto 
   * @returns 
   */
  @Post('/:creatorId')
  createComment(
    @Param('creatorId') creatorId: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
  ): Promise<CreatorCommentsEntity> {
    return this.creatorCommentService.createComment(creatorId, createCommentDto);
  }

  /**
   * 방송인 평가댓글 삭제하기
   * DELETE /creatorComment/:commentId
   * @param commentId 
   * @returns 삭제 성공시 true만 반환
   */
  @Delete('/:commentId')
  async deleteOneComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<boolean> {
    const result = await this.creatorCommentService.deleteOneComment(commentId);
    return result;
  }

  /**
   * 방송인 평가댓글 목록 불러오기
   * 최신순 GET /creatorComment/:creatorId?skip=0&order=date
   * 추천순 GET /creatorComment/:creatorId?skip=0&order=recommend
   * @param creatorId 
   * @param skip 페이지네이션 위해 몇개 건너띄고 가져올건지
   * @param order 'date' 인 경우 최신순으로, 'recommend'인 경우 추천많은 순으로
   * @returns 
   */
  @Get('/:creatorId')
  async getCreatorComments(
    @Ip() userIp: string,
    @Param('creatorId') creatorId: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('order') order: 'recommend' | 'date',
  ): Promise<ICreatorCommentsRes> {
    return this.creatorCommentService.getCreatorComments(creatorId, skip, order);
  }

  @Post('/password/:commentId')
  async checkPassword(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) checkPasswordDto: CheckPasswordDto,
  ): Promise<boolean> {
    const { password } = checkPasswordDto;
    return this.creatorCommentService.checkPassword(commentId, password);
  }

  /**
   * 해당 userIp가 좋아요 누른 commentId 목록 반환
   * GET /creatorComment/like-list
   * @param userIp 
   */
  @Get('like-list')
  async getLikes(
    @Ip() userIp: string,
  ): Promise<IGetLikes> {
    const likes = await this.creatorCommentLikeService.findLikesByUserIp(userIp);
    return { userIp, likes };
  }

  /**
  * 해당 userIp가 싫어요 누른 commentId 목록 반환
  * GET /creatorComment/hate-list
  * @param userIp 
  */
  @Get('hate-list')
  async getHates(
    @Ip() userIp: string,
  ): Promise<IGetHates> {
    const hates = await this.creatorCommentLikeService.findHatesByUserIp(userIp);
    return { userIp, hates };
  }

  /**
   * 방송인 평가 댓글에 좋아요 추가
   * POST /creatorComment/like/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 생성된 좋아요 row 반환
   */
  @Post('/like/:commentId')
  likeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): Promise<CreatorCommentLikesEntity> {
    return this.creatorCommentLikeService.like(commentId, userIp);
  }

  /**
   * 방송인 평가 댓글에 좋아요 삭제
   * DELETE /creatorComment/like/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 성공시 true만 반환
   */
  @Delete('/like/:commentId')
  removeLikeOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): Promise<boolean> {
    return this.creatorCommentLikeService.removeLike(commentId, userIp);
  }

  /**
   * 방송인 평가 댓글에 싫어요 추가
   * POST /creatorComment/hate/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 생성된 싫어요 row 반환
   */
  @Post('/hate/:commentId')
  hateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): Promise<CreatorCommentHatesEntity> {
    return this.creatorCommentLikeService.hate(commentId, userIp);
  }

  /**
   * 방소인 평가 댓글에 싫어요 삭제
   * DELETE /creatorComment/hate/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 성공시 true만 반환
   */
  @Delete('/hate/:commentId')
  removeHateOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): Promise<boolean> {
    return this.creatorCommentLikeService.removeHate(commentId, userIp);
  }
}
