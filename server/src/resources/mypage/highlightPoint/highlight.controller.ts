import express from 'express';
import {
  Controller, Param, Get, Query, Res, Req
} from '@nestjs/common';
import * as fs from 'fs';
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
    if (name && year && month && day) {
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
  @Get('/export')
  async getZipFile(@Query('id') id: string, @Query('year') year: string, @Query('month') month: string, @Query('day') day: string, @Query('streamId') streamId: string, @Query('srt') srt: number, @Query('csv') csv: number, @Query('txt') txt: number, @Req() req: express.Request, @Res() res: express.Response) {
    if (id) {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}`;
      const zip = await this.highlightService.getZipFile(id, year, month, day, streamId, srt, csv, txt);
      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename=${fileName}.zip`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      zip.pipe(res);
    }
  }
}
