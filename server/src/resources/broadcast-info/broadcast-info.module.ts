import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { BroadcastInfoService } from './broadcast-info.service';
import { BroadcastInfoController } from './broadcast-info.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamsEntity, StreamSummaryEntity,
      PlatformAfreecaEntity, PlatformTwitchEntity, UserEntity,
    ]),
    TypeOrmConfigService,
    UsersModule,
  ],
  controllers: [BroadcastInfoController],
  providers: [BroadcastInfoService],
  exports: [],
})
export class BroadcastInfoModule {}
