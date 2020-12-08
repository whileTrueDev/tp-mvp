import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { HighlightModule } from './resources/highlightPoint/hightlight.module';
import { FeatureModule } from './resources/featureSuggestion/featureSuggestion.module';
import { InquiryModule } from './resources/inquiry/inquiry.module';
import { TypeOrmConfigService } from './config/database.config';
import { NotificationModule } from './resources/notification/notification.module';
import { StreamAnalysisModule } from './resources/stream-analysis/stream-analysis.module';
import { CategoryModule } from './resources/category/category.module';

import loadConfig from './config/loadConfig';

import { roles } from './roles/app.roles';
import { SlackModule } from './resources/slack/slack.module';
import { NoticeModule } from './resources/notice/notice.module';
import { HealthCheckModule } from './resources/health-check/healthcheck.module';
import { BroadcastInfoModule } from './resources/broadcast-info/broadcast-info.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    HighlightModule,
    NotificationModule,
    StreamAnalysisModule,
    FeatureModule,
    InquiryModule,
    SlackModule,
    NoticeModule,
    CategoryModule,
    HealthCheckModule,
    BroadcastInfoModule,
  ],
})
export class AppModule { }
