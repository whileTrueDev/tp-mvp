import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { TypeOrmConfigService } from './config/database.config';

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
    UsersModule
  ],
})
export class AppModule {}
