import { Controller, Get } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
  ) {}

  @Get()
  test(): Promise<any> {
    return this.rankingsService.getTopTenViewerByPlatform();
  }
}
