import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { BroadcastInfoService } from './broadcast-info.service';
import { BroadcastInfoController } from './broadcast-info.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { StreamVotesEntity } from './entities/streamVotes.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { UserEntity } from '../users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamsEntity, StreamSummaryEntity, StreamVotesEntity,
      PlatformAfreecaEntity, PlatformTwitchEntity, UserEntity,
    ]),
    TypeOrmConfigService,
  ],
  controllers: [BroadcastInfoController],
  providers: [BroadcastInfoService],
  exports: [],
})
export class BroadcastInfoModule {}
