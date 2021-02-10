import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import express from 'express';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { CreateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/createReply.dto';
import { UpdateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/updateReply.dto';

import { CommunityBoardService } from './communityBoard.service';
import { CommunityReplyService } from './communityReply.service';
import { CommunityPostEntity } from './entities/community-post.entity';
import { CommunityReplyEntity } from './entities/community-reply.entity';
@Controller('community')
export class CommunityBoardController {
  constructor(
    private readonly communityBoardService: CommunityBoardService,
    private readonly communityReplyService: CommunityReplyService,
  ) {}

  /**
   * 
   * @param platform 'afreeca' | 'twitch' 플랫폼 구분
   * @param category 'all' | 'notice' | 'recommended' 전체글, 공지글, 추천글 조회용
   * @param page 보여질 페이지
   * @param take 해당 페이지에 보여지는 글의 개수
   */
  @Get()
  findAllPosts(
    @Query('platform') platform: string,
    @Query('category') category: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<{posts: CommunityPostEntity[], total: number}> {
    return this.communityBoardService.findAllPosts({
      platform,
      category: category || 'all',
      page: page < 1 ? 1 : page,
      take: take < 0 ? 10 : take,
    });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  createOnePost(
    @Req() request: express.Request,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, request.ip);
  }

  @Post('/:postId/recommend')
  recommendPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.communityBoardService.recommendPost(postId);
  }

  /**
   * 게시글 수정 PUT /community/:postId
   * @param postId 
   * @param updateCommunityBoardDto 
   *    title: string;
        content: string;
        password: string; -> not null일 것
   */
  @Put(':postId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateOnePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateCommunityBoardDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.updateOnePost(postId, updateCommunityBoardDto);
  }

  @Get(':postId')
  findOne(@Param('postId', ParseIntPipe) postId: number): Promise<CommunityPostEntity> {
    return this.communityBoardService.hitAndFindOnePost(postId);
  }

  /**
   * 글 삭제 DELETE /community/:postId
   * @param postId 
   */
  @Delete(':postId')
  removeOnePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityBoardService.removeOnePost(postId, password);
  }

  /**
   * 댓글 생성 POST /community/replies
   * @param request 
   * @param createReplyDto 
   *          nickname: string; 12자
              password: string; 4자
              content: string; 100자
              postId: number;
   */
  @Post('replies')
  @UsePipes(new ValidationPipe({ transform: true }))
  createReply(
    @Req() request: express.Request,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.createReply(createReplyDto, request.ip);
  }

  /**
   * 댓글삭제 DELETE /community/replies/:replyId
   * @param replyId 삭제할 댓글 id
   * @param password 댓글 비밀번호
   */
  @Delete('replies/:replyId')
  async removeReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityReplyService.removeReply(replyId, password);
  }

  /**
   * 댓글 수정 PUT /community/replies/:replyId
   * @param updateReplyDto 
   */
  @Put('replies/:replyId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.updateReply(replyId, updateReplyDto);
  }
}
