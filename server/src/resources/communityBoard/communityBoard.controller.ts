import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Put,
  Param,
  ParseIntPipe,
  // Delete,
} from '@nestjs/common';
import express from 'express';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityPostEntity } from './entities/community-post.entity';

@Controller('community')
export class CommunityBoardController {
  constructor(private readonly communityBoardService: CommunityBoardService) {}

  @Post()
  createOnePost(
    @Req() request: express.Request,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, request.ip);
  }

  @Put(':postId')
  updateOnePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateCommunityBoardDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.updateOnePost(postId, updateCommunityBoardDto);
  }

  @Get()
  test(): string {
    return 'test';
  }

  // @Get()
  // findAll() {
  //   return this.communityBoardService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.communityBoardService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.communityBoardService.remove(+id);
  // }
}
