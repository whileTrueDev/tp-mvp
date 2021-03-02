import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

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

import loadConfig from './config/loadConfig';

import { roles } from './roles/app.roles';
import { SlackModule } from './resources/slack/slack.module';
import { NoticeModule } from './resources/notice/notice.module';
import { HealthCheckModule } from './resources/health-check/healthcheck.module';
import { BroadcastInfoModule } from './resources/broadcast-info/broadcast-info.module';
import { CbtModule } from './resources/cbt/cbt.module';
import { CommunityBoardModule } from './resources/communityBoard/communityBoard.module';
import { RankingsModule } from './resources/rankings/rankings.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
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
    CbtModule,
    CommunityBoardModule,
    RankingsModule,
  ],
})
export class AppModule { }
