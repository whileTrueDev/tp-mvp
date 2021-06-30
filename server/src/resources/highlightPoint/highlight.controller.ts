import express from 'express';
import {
  Controller, Get, Query, Res, Req, HttpException, HttpStatus, Param,
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

  /**
   * 유투브 편집점 페이지 편집점 제공 목록 요청
   * GET /users/highlight-point-list/:platform
   * 플랫폼에 따라 최근 방송 종료순으로 
   * 크리에이터 활동명, userId, 최근방송제목, 최근방송종료시간, 플랫폼 정보를 반환한다
   * 
   * @param platform 'afreeca' | 'twitch'
   * 
   * @return EditingPointListResType[]
   * {   
   *  creatorId: string, // 크리에이터 ID(아프리카아이디 || 트위치아이디)
      platform: string, // 플랫폼 'afreeca' | 'twitch'
      userId: string,   // userId
      title: string,   // 가장 최근 방송 제목
      endDate: Date,   // 가장 최근 방송의 종료시간
      nickname: string // 크리에이터 활동명
   * }[]
   */
  @Get('/highlight-point-list/:platform')
  getHighlightPointList(
    @Param('platform') platform: 'afreeca'|'twitch',
  ): Promise<any[]> {
    return this.highlightService.getHighlightPointList(platform);
  }
}
