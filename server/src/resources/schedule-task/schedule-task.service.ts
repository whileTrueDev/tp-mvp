import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreatorRatingsService } from '../creatorRatings/creatorRatings.service';

@Injectable()
export class ScheduleTaskService {
  constructor(
    private readonly creatorRatingsService: CreatorRatingsService,
  ) {}

  /**
   * 전날 하루동안 평점 매겨진 방송인에 대해 평점 평균을 계산하고
   * DailyAverageRating에 날짜, 방송인, 평균평점을 저장
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleSaveDailyAverageRating(): void {
    // production 서버일때만 실행
    if (process.env.NODE_ENV === 'production') {
      this.creatorRatingsService.saveDailyAverageRating();
    }
  }
}
