import {
  Controller, Get, Post, Body,
  Patch, Delete, ValidationPipe,
  ParseIntPipe, UseInterceptors,
  ClassSerializerInterceptor, Query,
} from '@nestjs/common';
import { FeatureSuggestionStateUpdateDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionStateUpdate.dto';
import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { FeatureSuggestionPatchDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPatch.dto';
import { ReplyGet } from '@truepoint/shared/dist/dto/featureSuggestion/replyGet.dto';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { ReplyPatch } from '@truepoint/shared/dist/dto/featureSuggestion/replyPatch.dto';

import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';
import { FeatureSuggestionService } from './featureSuggestion.service';
import { FeatureSuggestionReplyService } from './featureSuggestionReply.service';

@Controller('feature-suggestion')
export class FeatureSuggestionController {
  constructor(
    private readonly featureSuggestionService: FeatureSuggestionService,
    private readonly featureSuggestionReplyService: FeatureSuggestionReplyService,
  ) { }

  /**
   * 기능제안 개별 글 조회 라우터
   * @param id (optional) 조회할 개별글 번호. 파라미터 추가하지 않을 시 모든 글 목록을 반환합니다.
   */
  @Get()
  async findOne(
    @Query('id') id: string,
  ): Promise<FeatureSuggestionEntity | FeatureSuggestionEntity[]> {
    if (id) {
      return this.featureSuggestionService.findOne(id);
    }
    return this.featureSuggestionService.findAll();
  }

  /**
   * 기능제안 목록 조회 라우터 ( 글의 내용 / 댓글 내용은 포함하지 않는 순수 목록만 반환)
   */
  @Get('list')
  async findAllList(): Promise<FeatureSuggestionEntity[]> {
    console.error('hi from feature-suggestion / list');
    return this.featureSuggestionService.findAllList();
  }

  /**
   * 기능제안 개별 글 생성 라우터
   * @param data 생성할 기능제안 데이터
   */
  @Post()
  async insertOne(
    @Body(ValidationPipe) featureSuggestionPostDto: FeatureSuggestionPostDto,
  ): Promise<FeatureSuggestionEntity> {
    return this.featureSuggestionService.insert(featureSuggestionPostDto);
  }

  /**
   * 기능제안 개별 글 수정 라우터
   * @param data 수정할 기능제안 데이터
   */
  @Patch()
  async updateOne(
    @Body(ValidationPipe) featureSuggestionPatchDto: FeatureSuggestionPatchDto,
  ): Promise<number> {
    return this.featureSuggestionService.update(featureSuggestionPatchDto);
  }

  /**
   * 기능제안 개별 글 삭제 라우터
   * @param id 기능제안 글 고유 ID
   */
  @Delete()
  async deleteOne(
    @Body('id', ParseIntPipe) id: number,
  ): Promise<number> {
    return this.featureSuggestionService.deleteOne(id);
  }

  /**
   * 기능제안 상태값 변경 라우터
   * @param data 상태값 변경할 기능제안 글 데이터
   */
  @Patch('state')
  async updateSuggestion(
    @Body(ValidationPipe) data: FeatureSuggestionStateUpdateDto,
  ): Promise<number> {
    return this.featureSuggestionService.stateUpdate(data);
  }

  // ****************************************************************************************
  // ********************************* feature suggestion reply *****************************
  @Get('reply')
  async getReply(
    @Query(ValidationPipe) req: ReplyGet,
  ): Promise<FeatureSuggestionReplyEntity[]> {
    return this.featureSuggestionReplyService.findAll(req);
  }

  @Post('reply')
  @UseInterceptors(ClassSerializerInterceptor)
  async createReply(
    @Body(ValidationPipe) data: ReplyPost,
  ): Promise<FeatureSuggestionReplyEntity> {
    return this
      .featureSuggestionReplyService
      .insertOne(data);
  }

  @Patch('reply')
  async updateReply(
    @Body(ValidationPipe) data: ReplyPatch,
  ): Promise<number> {
    return this
      .featureSuggestionReplyService
      .updateOne(data);
  }

  @Delete('reply')
  async deleteReply(
    @Body(ValidationPipe) data: Pick<ReplyPatch, 'id'>,
  ): Promise<number> {
    return this
      .featureSuggestionReplyService
      .deleteOne(data);
  }
}
