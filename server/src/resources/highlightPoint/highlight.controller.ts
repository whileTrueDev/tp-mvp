import express from 'express';
import {
  Controller, Get, Query, Res, Req, HttpException, HttpStatus, DefaultValuePipe,
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

  // eslint-disable-next-line max-params
  @Get('/export')
  async getZipFile(
    @Query('creatorId') creatorId: string,
    @Query('platform') platform: 'afreeca'|'youtube'|'twitch',
    @Query('streamId') streamId: string,
    @Query('exportCategory') exportCategory: string,
    @Query('srt') srt: number,
    @Query('csv') csv: number,
    @Query('startTime', new DefaultValuePipe('')) startTime: string,
    // @Query('txt') txt: number,
    @Req() req: express.Request, @Res() res: express.Response,
  ): Promise<any> {
    if (streamId) {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}`;
      const zip = await this.highlightService.getHighlightZipFile(
        creatorId, platform, streamId, exportCategory, srt, csv,
        startTime,
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

  // eslint-disable-next-line max-params
  @Get('/full-sound-file')
  async getFullSoundFile(
    @Query('creatorId') creatorId: string,
    @Query('platform') platform: 'afreeca'|'youtube'|'twitch',
    @Query('streamId') streamId: string,
    @Res() res: express.Response,
  ): Promise<any> {
    if (streamId) {
      const stream = await this.highlightService.getSoundFileStream(
        { creatorId, platform, streamId },
      );

      res.set({
        'Content-Type': 'audio/mpeg3;audio/x-mpeg-3;video/mpeg;video/x-mpeg;text/xml',
        'Content-Disposition': 'attachment',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      stream.pipe(res);
    }
    return `no streamId : ${streamId}`;
  }
}
