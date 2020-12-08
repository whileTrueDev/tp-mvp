import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { BroadcastInfoService } from './broadcast-info.service';
import { BroadcastInfoController } from './broadcast-info.controller';

import { StreamsTest2Entity } from './entities/streamsTest2.entity';
import { StreamSummaryTest2Entity } from './entities/streamSummaryTest2.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamsTest2Entity, StreamSummaryTest2Entity]),
    TypeOrmConfigService,
  ],
  controllers: [BroadcastInfoController],
  providers: [BroadcastInfoService],
  exports: [],
})
export class BroadcastInfoModule {}
