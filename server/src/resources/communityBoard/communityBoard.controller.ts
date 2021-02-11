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
   * 댓글조회 GET /community/replies?postId=&page=&take=
   * @param postId 댓글 조회할 글id
   * @param page 댓글 페이지
   * @param take 가져올 댓글 개수
   */
  @Get('replies')
  findReplies(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<{replies: CommunityReplyEntity[], total: number}> {
    return this.communityReplyService.findReplies({
      postId,
      page: page < 1 ? 1 : page,
      take: take < 0 ? 10 : take,
    });
  }

  /**
   * 게시글 조회 GET /community/posts?platform=&page=&take=&category=
   * @param platform 'afreeca' | 'twitch' 플랫폼 구분
   * @param category 'all' | 'notice' | 'recommended' 전체글, 공지글, 추천글 조회용
   * @param page 보여질 페이지
   * @param take 해당 페이지에 보여지는 글의 개수
   */
  @Get('posts')
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

  /**
   * 게시글 작성 POST /community/posts
   * @param request 
   * @param createCommunityPostDto 
   */
  @Post('posts')
  @UsePipes(new ValidationPipe({ transform: true }))
  createOnePost(
    @Req() request: express.Request,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, request.ip);
  }

  /**
   * 게시글 추천 POST /community/posts/:postId/recommend
   * @param postId 
   */
  @Post('posts/:postId/recommend')
  recommendPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.communityBoardService.recommendPost(postId);
  }

  /**
   * 게시글 수정 PUT /community/posts/:postId
   * @param postId 
   * @param updateCommunityBoardDto 
   *    title: string;
        content: string;
        password: string; -> not null일 것
   */
  @Put('posts/:postId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateOnePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateCommunityBoardDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.updateOnePost(postId, updateCommunityBoardDto);
  }

  /**
   * 단일 글 조회 GET /community/posts/:postId
   * @param postId 
   */
  @Get('posts/:postId')
  findOne(@Param('postId', ParseIntPipe) postId: number): Promise<CommunityPostEntity> {
    return this.communityBoardService.hitAndFindOnePost(postId);
  }

  /**
   * 글 삭제 DELETE /community/posts/:postId
   * @param postId 
   */
  @Delete('posts/:postId')
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
   *   password: string;
       content: string; 100자 제한
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
