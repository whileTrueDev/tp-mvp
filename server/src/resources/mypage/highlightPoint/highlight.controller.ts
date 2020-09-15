import {
  Controller, Param, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req
} from '@nestjs/common';
import { HighlightService } from './highlight.service';

@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) { }
  @Get('/list')
  getList(@Query('name') name: string) {
    if (name) {
      console.log(this.highlightService.getList(name));
      return this.highlightService.getList(name);
    }
    return 400;
  }
  @Get('/points')
  getHighlightData(@Query('path') path: string) {
    if (path) {
      return this.highlightService.getHighlightData(path);
    }
    return 400;
  }
  @Get('/metrics')
  getMetricData(@Query('path') path: string) {
    if (path) {
      return this.highlightService.getMetricData(path);
    }
    return 400;
  }
}
