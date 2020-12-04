import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamAnalysisController } from './stream-analysis.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { UsersModule } from '../users/users.module';
import { StreamsTest2Entity } from './entities/streamsTest2.entity';
import { StreamSummaryTest2Entity } from './entities/streamSummaryTest2.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamsEntity, StreamSummaryEntity, StreamsTest2Entity, StreamSummaryTest2Entity]),
    TypeOrmConfigService,
    UsersModule,
  ],
  controllers: [StreamAnalysisController],
  providers: [StreamAnalysisService],
  exports: [],
})
export class StreamAnalysisModule {}
