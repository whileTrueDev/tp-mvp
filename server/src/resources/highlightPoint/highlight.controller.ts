import express from 'express';
import {
  Controller, Get, Query, Res, Req, HttpException, HttpStatus, Param, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { HighlightPointListResType } from '@truepoint/shared/res/HighlightPointListResType.interface';
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

  /**
   * 유투브 편집점 페이지 편집점 제공 목록 요청
   * GET /users/highlight-point-list/:platform
   * 플랫폼에 따라 최근 방송 종료순으로 
   * 크리에이터 활동명, userId, 최근방송제목, 최근방송종료시간, 플랫폼 정보를 반환한다
   * 
   * @param platform 'afreeca' | 'twitch'
   * @param page 몇 번째 페이지 
   * @param take 페이지 당 몇 개
   */
  @Get('/highlight-point-list/:platform')
  getHighlightPointList(
    @Param('platform') platform: 'afreeca'|'twitch',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('take', new DefaultValuePipe(30), ParseIntPipe) take: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ): Promise<HighlightPointListResType> {
    return this.highlightService.getHighlightPointList({
      platform, page, take, search,
    });
  }
}
