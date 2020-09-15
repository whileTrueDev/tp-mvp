import {
  Controller, Param, Get, Query
} from '@nestjs/common';
import { HighlightService } from './highlight.service';

@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) { }
  @Get('/list')
  getDateList(@Query('name') name: string, @Query('year') year: string, @Query('month') month: string,) {
    if (name) {
      return this.highlightService.getDateList(name, year, month);
    }
  }
  @Get('/stream')
  getStreamList(@Query('name') name: string, @Query('year') year: string, @Query('month') month: string, @Query('day') day: string,) {
    if (name && year && month) {
      return this.highlightService.getStreamList(name, year, month, day);
    }
  }
  @Get('/points')
  getHighlightData(@Query('path') path: string) {
    if (path) {
      return this.highlightService.getHighlightData(path);
    }
  }
  @Get('/metrics')
  getMetricData(@Query('path') path: string) {
    if (path) {
      return this.highlightService.getMetricData(path);
    }
  }
}
