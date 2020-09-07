import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { CatsModule } from './resources/cats/cats.module';
import { AuthModule } from './resources/auth/auth.module';
// import { UsersModule } from './resources/users/users.module';

import loadConfig from './config/loadConfig';
import { TypeOrmConfigService } from './config/database.config';
import { NotificationModule } from './resources/notification/notification.module';
import { StreamAnalysisService } from './resources/stream-analysis/stream-analysis.service';
import { StreamAnalysisModule } from './resources/stream-analysis/stream-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    // CatsModule,
    // AuthModule,
    // UsersModule,
    NotificationModule,
    StreamAnalysisModule,
  ],
})
export class AppModule {}
