import express from 'express';
import {
  Controller, Get, Query, Res, Req, HttpException, HttpStatus
} from '@nestjs/common';
import { HighlightService } from './highlight.service';
@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) { }
  @Get('/list')
  async getDateListForCalendar(
    @Query('name') name: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<string[]> {
    if (name) {
      return this.highlightService.getDateListForCalendar(name, year, month);
    }
    throw new HttpException('name is required!!', HttpStatus.BAD_REQUEST);
  }

  @Get('/stream')
  getStreamListForCalendarBtn(
    @Query('name') name: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('day') day: string
  ): Promise<string[]> {
    if (name && year && month && day) {
      return this.highlightService.getStreamListForCalendarBtn(name, year, month, day);
    }
    throw new HttpException('name && year && month && day are required!!', HttpStatus.BAD_REQUEST);
  }

  @Get('/highlight-points')
  getHighlightData(@Query('id') id: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('day') day: string, @Query('fileId') fileId: string): Promise<any> {
    if (id) {
      return this.highlightService.getHighlightData(id, year, month, day, fileId);
    }
    throw new HttpException('id is required!!', HttpStatus.BAD_REQUEST);
  }

  @Get('/metrics')
  async getMetricsData(
    @Query('id') id: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('day') day: string,
    @Query('fileId') fileId: string
  ): Promise<any> {
    if (id) {
      return this.highlightService.getMetricsData(id, year, month, day, fileId);
    }
    throw new HttpException('id is required!!', HttpStatus.BAD_REQUEST);
  }

  @Get('/export')
  async getZipFile(
    @Query('id') id: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('day') day: string,
    @Query('streamId') streamId: string,
    @Query('srt') srt: number,
    @Query('csv') csv: number,
    @Query('txt') txt: number,
    @Req() req: express.Request, @Res() res: express.Response
  ): Promise<any> {
    if (id) {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}`;
      const zip = await this.highlightService.getZipFile(
        id, year, month, day, streamId, srt, csv, txt
      );
      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename=${fileName}.zip`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      zip.pipe(res);
    }
  }
}
