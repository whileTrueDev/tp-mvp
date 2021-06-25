import express from 'express';
import {
  Controller, Get, Query, Res, Req, HttpException, HttpStatus,
} from '@nestjs/common';
import { HighlightService } from './highlight.service';

@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) { }

  @Get('/highlight-points')
  getHighlightData(@Query('streamId') streamId: string,
  @Query('platform') platform: string,
  @Query('creatorId') creatorId: string): Promise<any> {
    if (streamId) {
      return this.highlightService.getHighlightData(streamId, platform, creatorId);
    }
    throw new HttpException('id is required!!', HttpStatus.BAD_REQUEST);
  }

  @Get('/export')
  async getZipFile(
    @Query('creatorId') creatorId: string,
    @Query('platform') platform: 'afreeca'|'youtube'|'twitch',
    @Query('streamId') streamId: string,
    @Query('exportCategory') exportCategory: string,
    @Query('srt') srt: number,
    @Query('csv') csv: number,
    // @Query('txt') txt: number,
    @Req() req: express.Request, @Res() res: express.Response,
  ): Promise<any> {
    if (streamId) {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}`;
      const zip = await this.highlightService.getZipFile(
        creatorId, platform, streamId, exportCategory, srt, csv,
        // txt,
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
