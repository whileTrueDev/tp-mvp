import {
  Controller, Get, Req, Post
} from '@nestjs/common';
import { Request } from 'express';
import { FeatureService } from './feature.service';
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) { }
  @Get()
  getData(@Req() request: Request) {
    return this.featureService.getData();
  }
}
