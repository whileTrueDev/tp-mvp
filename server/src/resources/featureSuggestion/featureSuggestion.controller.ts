import {
  Controller, Get, Req, Post, Body, Patch, Delete, Query,
} from '@nestjs/common';
import { Request } from 'express';
import { FeatureSuggestionService } from './featureSuggestion.service';

@Controller('feature')
export class FeatureSuggestionController {
  constructor(private readonly featureSuggestionService: FeatureSuggestionService) { }

  @Get()
  getBoardData(@Req() request: Request): Promise<any> {
    return this.featureSuggestionService.getBoardData();
  }

  @Post('/upload')
  // @hwasurr 2020.10.13 eslint error 정리중 disalbe
  // @leejineun 올바른 타입 정의 후 처리바람니다~~!! 처리 이후 eslint-disable 주석 제거해주세요
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  insertFeatureSuggestion(@Body() data): Promise<any> {
    return this.featureSuggestionService.insertFeatureSuggestion(data);
  }

  @Get('/get-edit')
  getEditData(@Query('authorId') authorId: string, @Query('postId') postId: number): Promise<any> {
    return this.featureSuggestionService.getEditData(authorId, postId);
  }

  @Patch('/upload-edit')
  // @hwasurr 2020.10.13 eslint error 정리중 disalbe
  // @leejineun 올바른 타입 정의 후 처리바람니다~~!! 처리 이후 eslint-disable 주석 제거해주세요
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateFeatureSuggestion(@Body() data): Promise<any> {
    return this.featureSuggestionService.updateFeatureSuggestion(data);
  }

  @Delete('/upload-delete')
  deleteFeatureSuggestion(@Query('data') data: number): Promise<any> {
    return this.featureSuggestionService
      .deleteFeatureSuggestion(data);
  }
  // uploadImage(@Body() data) {
  //   console.log(data);
  //   return this.featureSuggestionService.uploadImage(data);
  // }
}
