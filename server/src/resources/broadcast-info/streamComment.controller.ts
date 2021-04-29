import {
  Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query, ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CheckPasswordDto } from '@truepoint/shared/dist/dto/creatorComment/checkPassword.dto';
import { StreamCommentService } from './streamComment.service';
import { StreamCommentVoteService } from './streamCommentVote.service';
import { StreamCommentsEntity } from './entities/streamComment.entity';

@Controller('streamComment')
export class StreamCommentController {
  constructor(
    private readonly streamCommentService: StreamCommentService,
    private readonly streamCommentVoteService: StreamCommentVoteService,
  ) {}

  /**
   * 방송 대댓글 생성
   * @param commentId 
   * @param createCommentDto 
   * @returns 
   */
  @Post('/replies/:commentId')
  CreateChildrenComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
  ): Promise<StreamCommentsEntity> {
    return this.streamCommentService.createChildrenComment(commentId, createCommentDto);
  }

  /**
   * 방송 댓글 생성
   * @param streamId 
   * @param createCommentDto 
   * @returns 
   */
  @Post('/:streamId')
  createComment(
    @Param('streamId') streamId: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
  ): any {
    return this.streamCommentService.createComment(streamId, createCommentDto);
  }

  /**
   * 방송 댓글 삭제하기
   * @param commentId 
   * @returns 삭제 성공시 true만 반환
   */
  @Delete('/:commentId')
  async deleteOneComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<boolean> {
    const result = await this.streamCommentService.deleteOneComment(commentId);
    return result;
  }

  /**
   * 방송 댓글, 대댓글 비밀번호 확인
   * @param commentId 
   * @param checkPasswordDto 
   * @returns 
   */
  @Post('/password/:commentId')
  async checkPassword(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) checkPasswordDto: CheckPasswordDto,
  ): Promise<boolean> {
    const { password } = checkPasswordDto;
    return this.streamCommentService.checkPassword(commentId, password);
  }

  /**
   * 방송 댓글에 좋아요/싫어요 요청
   * @param commentId 
   * @param userIp 
   * @param userId 
   * @param vote 0 | 1, 0인경우 해당 comment 싫어요, 1인경우 해당 comment 좋아요 요청
   * @returns 
   * {like: 0 , hate: 1} : 싫어요 생성 (아무것도 눌리지 않은 상태에서 싫어요 누른 경우)
   * {like: 0 , hate: -1} : 싫어요 삭제 (싫어요 눌려있던 상태에서 싫어요 누른 경우)
   * {like: -1 , hate: 1} : 좋아요 -> 싫어요 수정(좋아요 눌려있던 상태에서 싫어요 누른 경우)
   * {like: 1 , hate: 0} : 좋아요 생성(아무것도 눌리지 않은 상태에서 좋아요 누른 경우)
   * {like: -1 , hate: 0} : 좋아요 삭제 (좋아요 눌려있던 상태에서 좋아요 누른 경우)
   * {like: 1 , hate: -1} : 싫어요 -> 좋아요 수정(싫어요 눌려있던 상태에서 좋아요 누른 경우)
   * 
   */
  @Post('vote/:commentId')
  vote(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Ip() userIp: string,
    @Body('userId') userId: string|undefined,
    @Body('vote', ParseIntPipe) vote: 1|0, // vote:1 이면 추천, vote:0이면 비추천
  ): any {
    return this.streamCommentVoteService.vote(commentId, userIp, userId, vote);
  }

  /**
   * 방송 댓글 신고
   * @param commentId 
   * @returns 
   */
  @Post('report/:commentId')
  reportComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<boolean> {
    return this.streamCommentService.report(commentId);
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
    return this.streamCommentService.getReplies(commentId);
  }

  /**
   * 방송 댓글 목록 불러오기
   * @param creatorId 
   * @param skip 페이지네이션 위해 몇개 건너띄고 가져올건지
   * @param order 'date' 인 경우 최신순으로, 'recommend'인 경우 추천많은 순으로
   * @returns 
   */
  @Get('/:streamId')
  async getStreamComments(
       @Param('streamId') streamId: string,
       @Query('skip', ParseIntPipe) skip: number,
       @Query('order') order: 'recommend' | 'date',
  ): Promise<any> {
    return this.streamCommentService.getStreamComments(streamId, skip, order);
  }
}
