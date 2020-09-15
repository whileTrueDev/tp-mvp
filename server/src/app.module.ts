import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CatsModule } from './resources/cats/cats.module';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { HighlightModule } from './resources/mypage/highlightPoint/hightlight.module';

import loadConfig from './config/loadConfig';
import { TypeOrmConfigService } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    CatsModule,
    AuthModule,
    UsersModule,
    HighlightModule
  ],
})
export class AppModule { }
