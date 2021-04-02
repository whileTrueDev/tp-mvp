import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CheckPasswordDto } from '@truepoint/shared/dist/dto/creatorComment/checkPassword.dto';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentLikeService } from './creatorCommentLike.service';

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
  ): any {
    return this.creatorCommentService.createComment(creatorId, createCommentDto);
  }

  /**
   * 해당 userIp가 좋아요 누른 commentId 목록 반환
   * @param userIp 
   */
  @Get('like-list')
  async getLikes(
    @Ip() userIp: string,
  ): Promise<any> {
    const likes = await this.creatorCommentLikeService.findLikesByUserIp(userIp);
    return { userIp, likes };
  }

  /**
   * 해당 userIp가 싫어요 누른 commentId 목록 반환
   * @param userIp 
   */
  @Get('hate-list')
  async getHates(
    @Ip() userIp: string,
  ): Promise<any> {
    const hates = await this.creatorCommentLikeService.findHatesByUserIp(userIp);
    return { userIp, hates };
  }

  /**
   * 방송인 평가댓글 삭제하기
   * DELETE /creatorComment/:commentId
   * @param commentId 
   * @returns 
   */
  @Delete('/:commentId')
  async deleteOneComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<any> {
    const result = await this.creatorCommentService.deleteOneComment(commentId);
    return result;
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
   * 방송인 평가 댓글에 좋아요 추가
   * POST /creatorComment/like/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 
   */
  @Post('/like/:commentId')
  likeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): any {
    return this.creatorCommentLikeService.like(commentId, userIp);
  }

  @Post('/like/:commentId/test/:ip')
  likeCommenttest(
    @Param('ip') ip: string,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): any {
    return this.creatorCommentLikeService.like(commentId, ip);
  }

  /**
   * 방송인 평가 댓글에 좋아요 삭제
   * DELETE /creatorComment/like/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 
   */
  @Delete('/like/:commentId')
  removeLikeOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): any {
    return this.creatorCommentLikeService.removeLike(commentId, userIp);
  }

  /**
   * 방송인 평가 댓글에 싫어요 추가
   * POST /creatorComment/hate/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 
   */
  @Post('/hate/:commentId')
  hateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): any {
    return this.creatorCommentLikeService.hate(commentId, userIp);
  }

  /**
   * 방소인 평가 댓글에 싫어요 삭제
   * DELETE /creatorComment/hate/:commentId
   * @param commentId 
   * @param userIp 
   * @returns 
   */
  @Delete('/hate/:commentId')
  removeHateOnComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
  ): any {
    return this.creatorCommentLikeService.removeHate(commentId, userIp);
  }

  @Get('test')
  findAllComments(): any {
    return this.creatorCommentService.findAllComments();
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
  ): Promise<any> {
    return this.creatorCommentService.getCreatorComments(creatorId, skip, order);
  }
}
