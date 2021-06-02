import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

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

import loadConfig from './config/loadConfig';

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
    CommunityBoardModule,
    RankingsModule,
    UserReactionModule,
    CreatorRatingsModule,
    CreatorCommentModule,
    CreatorCategoryModule,
    S3Module,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.google.com',
        port: 587,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'a1919361@gmail.com', // OAuth Client에서 테스트 사용자로 등록된 Gmail 주소 
          clientId: '974164894170-1q03v0mb6qcqc3ioqm7tk8f5kppi373b.apps.googleusercontent.com', // gmail  OAuth Client ID 
          clientSecret: 'wwOMiV46SppMqe9vVKfWGoIH', //  OAuth Client 보안 비밀
          refreshToken: '1//04UADw5dk-VliCgYIARAAGAQSNwF-L9IrG3ALWy8OPTkHxsRwH87yOw-dmNUv1Q1s4wXwgHHJcGve36M6VM61GHWcTuBilKVrbss', // playground에서 발급받은 Refresh token
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
})
export class AppModule { }
