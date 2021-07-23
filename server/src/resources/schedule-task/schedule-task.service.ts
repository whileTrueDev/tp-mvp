import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CreatorRatingsService } from '../creatorRatings/creatorRatings.service';

@Injectable()
export class ScheduleTaskService {
  constructor(
    private readonly configService: ConfigService,
    private readonly creatorRatingsService: CreatorRatingsService,
  ) {}

  private readonly isProductionEnvironment = this.configService.get('NODE_ENV') === 'production';

  /**
   * 전날 하루동안 평점 매겨진 방송인에 대해 평점 평균을 계산하고
   * DailyAverageRating에 날짜, 방송인, 평균평점을 저장
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleSaveDailyAverageRating(): void {
    if (this.isProductionEnvironment) {
      this.creatorRatingsService.saveDailyAverageRating();
    }
  }
}
