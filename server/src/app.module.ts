import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

import { AdminModule } from './resources/admin/admin.module';

import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { HighlightModule } from './resources/mypage/highlightPoint/hightlight.module';

import { TypeOrmConfigService } from './config/database.config';
import { NotificationModule } from './resources/notification/notification.module';
import { StreamAnalysisModule } from './resources/stream-analysis/stream-analysis.module';

import loadConfig from './config/loadConfig';

import { roles } from './roles/app.roles';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    HighlightModule,
    NotificationModule,
    StreamAnalysisModule,
    AdminModule
  ],
})
export class AppModule { }
