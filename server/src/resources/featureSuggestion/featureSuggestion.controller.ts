import {
  Controller, Get, Req, Post, Body, Patch, Delete, Param, Query
} from '@nestjs/common';
import { Request } from 'express';
import { FeatureSuggestionService } from './featureSuggestion.service';
import { FeatureSuggestionDto } from './dto/featureSuggestion.dto';
@Controller('feature')
export class FeatureSuggestionController {
  constructor(private readonly featureSuggestionService: FeatureSuggestionService) { }
  @Get()
  getBoardData(@Req() request: Request) {
    return this.featureSuggestionService.getBoardData();
  }
  @Post('/upload')
  insertFeatureSuggestion(@Body() data) {
    return this.featureSuggestionService.insertFeatureSuggestion(data);
  }
  @Patch('/upload-edit')
  updateFeatureSuggestion(@Body() data) {
    return this.featureSuggestionService.updateFeatureSuggestion(data);
  }
  @Delete('/upload-delete')
  deleteFeatureSuggestion(@Query('data') data: number) {
    return this.featureSuggestionService.deleteFeatureSuggestion(data);
  }
  // uploadImage(@Body() data) {
  //   console.log(data);
  //   return this.featureSuggestionService.uploadImage(data);
  // }
}
