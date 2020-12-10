import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { BroadcastInfoService } from './broadcast-info.service';
import { BroadcastInfoController } from './broadcast-info.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([StreamsEntity, StreamSummaryEntity]),
    TypeOrmConfigService,
  ],
  controllers: [BroadcastInfoController],
  providers: [BroadcastInfoService],
  exports: [],
})
export class BroadcastInfoModule {}
