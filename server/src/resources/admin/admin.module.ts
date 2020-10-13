import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { NoticeEntity } from '../notice/entities/notice.entity';
import { NotificationEntity } from '../notification/entities/notification.entity';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    NoticeEntity,
    NotificationEntity,
    FeatureSuggestionEntity,
    FeatureSuggestionReplyEntity,
  ])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
