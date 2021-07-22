import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { CreatorRatingsModule } from '../creatorRatings/creatorRatings.module';

@Module({
  imports: [CreatorRatingsModule],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
