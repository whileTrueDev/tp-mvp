import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';
import { AdminModule } from '@admin-bro/nestjs';
import AdminBro from 'admin-bro';
import { Database, Resource } from '@admin-bro/typeorm';
import { validate } from 'class-validator';

import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { HighlightModule } from './resources/highlightPoint/hightlight.module';
import { FeatureModule } from './resources/featureSuggestion/featureSuggestion.module';
import { InquiryModule } from './resources/inquiry/inquiry.module';
import { CbtInquiryModule } from './resources/cbtinquiry/cbtinquiry.module';
import { TypeOrmConfigService } from './config/database.config';
import { CollectorTypeOrmConfigService } from './config/collector.database.config';
import { NotificationModule } from './resources/notification/notification.module';
import { StreamAnalysisModule } from './resources/stream-analysis/stream-analysis.module';
import { CategoryModule } from './resources/category/category.module';

import configOptions from './config/configOptions';
import { mailerConfig } from './config/mailer.config';
import { getAdminOptions } from './admin-panel/admin-panel.options';

import { roles } from './roles/app.roles';
import { SlackModule } from './resources/slack/slack.module';
import { NoticeModule } from './resources/notice/notice.module';
import { HealthCheckModule } from './resources/health-check/healthcheck.module';
import { BroadcastInfoModule } from './resources/broadcast-info/broadcast-info.module';
import { CommunityBoardModule } from './resources/communityBoard/communityBoard.module';
import { RankingsModule } from './resources/rankings/rankings.module';
import { UserReactionModule } from './resources/userReaction/userReaction.module';
import { CreatorRatingsModule } from './resources/creatorRatings/creatorRatings.module';
import { CreatorCommentModule } from './resources/creatorComment/creatorComment.module';
import { CreatorCategoryModule } from './resources/creator-category/creator-category.module';
import { S3Module } from './resources/s3/s3.module';
import { ScheduleTaskModule } from './resources/schedule-task/schedule-task.module';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forRootAsync({
      name: 'WhileTrueCollectorDB',
      useClass: CollectorTypeOrmConfigService,
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    HighlightModule,
    NotificationModule,
    StreamAnalysisModule,
    FeatureModule,
    InquiryModule,
    CbtInquiryModule,
    SlackModule,
    NoticeModule,
    CategoryModule,
    HealthCheckModule,
    BroadcastInfoModule,
    CommunityBoardModule,
    RankingsModule,
    UserReactionModule,
    CreatorRatingsModule,
    CreatorCommentModule,
    CreatorCategoryModule,
    S3Module,
    MailerModule.forRoot(mailerConfig),
    AdminModule.createAdminAsync({
      useFactory: getAdminOptions,
    }),
    ScheduleModule.forRoot(),
    ScheduleTaskModule,
  ],
})
export class AppModule { }
