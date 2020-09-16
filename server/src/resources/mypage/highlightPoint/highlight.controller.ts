import {
  Controller, Param, Get, Query
} from '@nestjs/common';
import { HighlightService } from './highlight.service';

@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) { }
  @Get('/list')
  getDateListForCalendar(@Query('name') name: string, @Query('year') year: string, @Query('month') month: string,) {
    if (name) {
      return this.highlightService.getDateListForCalendar(name, year, month);
    }
  }
  @Get('/stream')
  getStreamListForCalendarBtn(@Query('name') name: string, @Query('year') year: string, @Query('month') month: string, @Query('day') day: string,) {
    if (name && year && month) {
      return this.highlightService.getStreamListForCalendarBtn(name, year, month, day);
    }
  }
  @Get('/highlight-points')
  getHighlightData(@Query('id') id: string, @Query('year') year: string, @Query('month') month: string, @Query('day') day: string, @Query('fileId') fileId: string) {
    if (id) {
      return this.highlightService.getHighlightData(id, year, month, day, fileId);
    }
  }
  @Get('/metrics')
  getMetricsData(@Query('id') id: string, @Query('year') year: string, @Query('month') month: string, @Query('day') day: string, @Query('fileId') fileId: string) {
    if (id) {
      return this.highlightService.getMetricsData(id, year, month, day, fileId);
    }
  }
}
