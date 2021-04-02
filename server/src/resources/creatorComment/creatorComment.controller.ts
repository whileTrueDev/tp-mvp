import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, ValidationPipe,
} from '@nestjs/common';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentLikeService } from './creatorCommentLike.service';

export interface CreateCommentDto {
  userId?: null|string,
  nickname: string,
  password: string,
  content: string
}

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

  @Get('/:creatorId')
  async getCreatorComments(
    @Param('creatorId') creatorId: string,
    @Ip() userIp: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('order') order: 'recommend' | 'date',
  ): Promise<any> {
    const data = await this.creatorCommentService.getCreatorComments(creatorId, skip, order);
    return { userIp, data };
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
}
