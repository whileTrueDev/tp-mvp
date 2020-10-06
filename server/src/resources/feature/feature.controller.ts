import {
  Controller, Get, Req, Post, Body, Patch, Delete, Param, Query
} from '@nestjs/common';
import { Request } from 'express';
import { FeatureService } from './feature.service';
import { FeatureDto } from './dto/feature.DTO';
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) { }
  @Get()
  getBoardData(@Req() request: Request) {
    return this.featureService.getBoardData();
  }
  @Post('/upload')
  insertFeatureSuggestion(@Body() data) {
    return this.featureService.insertFeatureSuggestion(data);
  }
  @Patch('/upload-edit')
  updateFeatureSuggestion(@Body() data) {
    return this.featureService.updateFeatureSuggestion(data);
  }
  @Delete('/upload-delete')
  deleteFeatureSuggestion(@Query('data') data: number) {
    return this.featureService.deleteFeatureSuggestion(data);
  }
  // uploadImage(@Body() data) {
  //   console.log(data);
  //   return this.featureService.uploadImage(data);
  // }
}
