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
  // ValidationPipe,
  // Res,
} from '@nestjs/common';
import express from 'express';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';

import { CommunityBoardService } from './communityBoard.service';
import { CommunityPostEntity } from './entities/community-post.entity';
@Controller('community')
export class CommunityBoardController {
  constructor(private readonly communityBoardService: CommunityBoardService) {}

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
  createOnePost(
    @Req() request: express.Request,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, request.ip);
  }

  @Post('/:postId/recommend')
  recommendPost(
    // @Req() request: express.Request,
    // @Res() response: express.Response,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    // 1일 1회 추천만 가능하도록 수정해야함
    return this.communityBoardService.recommendPost(postId);
  }

  @Put(':postId')
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

  @Delete(':postId')
  remove(@Param('postId', ParseIntPipe) postId: number): Promise<boolean> {
    return this.communityBoardService.removeOnePost(postId);
  }

  @Get()
  test(): string {
    return 'test';
  }
}
