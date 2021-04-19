import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CheckPasswordDto } from '@truepoint/shared/dist/dto/creatorComment/checkPassword.dto';
import { ICreatorCommentsRes, IGetHates, IGetLikes } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentVoteService } from './creatorCommentVote.service';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { CreatorCommentVoteEntity } from './entities/creatorCommentVote.entity';
@Controller('creatorComment')
export class CreatorCommentController {
  constructor(
    private readonly creatorCommentService: CreatorCommentService,
    private readonly creatorCommentVoteService: CreatorCommentVoteService,
  ) {}

  @Post('/replies/:commentId')
  CreateChildrenComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
  ): Promise<CreatorCommentsEntity> {
    return this.creatorCommentService.createChildrenComment(commentId, createCommentDto);
  }

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
    const likes = await this.creatorCommentVoteService.findLikesByUserIp(userIp);
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
    const hates = await this.creatorCommentVoteService.findHatesByUserIp(userIp);
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
    @Body('userId') userId: string|undefined,
  ): Promise<CreatorCommentVoteEntity> {
    return this.creatorCommentVoteService.like(commentId, userIp, userId);
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
    @Body('userId') userId: string|undefined,
  ): Promise<boolean> {
    return this.creatorCommentVoteService.removeLike(commentId, userIp, userId);
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
    @Body('userId') userId: string|undefined,
  ): Promise<CreatorCommentVoteEntity> {
    return this.creatorCommentVoteService.hate(commentId, userIp, userId);
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
    @Body('userId') userId: string|undefined,
  ): Promise<boolean> {
    return this.creatorCommentVoteService.removeHate(commentId, userIp, userId);
  }

  @Post('report/:commentId')
  reportComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<boolean> {
    return this.creatorCommentService.report(commentId);
  }

  /**
   * 대댓글(자식댓글)목록 가져오기
   * @param commentId 부모댓글 commentId
   * @returns 
   */
  @Get('/replies/:commentId')
  async getReplies(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<any> {
    return this.creatorCommentService.getReplies(commentId);
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
}
