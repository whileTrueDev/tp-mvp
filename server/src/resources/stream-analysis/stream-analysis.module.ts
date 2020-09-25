import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamAnalysisController } from './stream-analysis.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamsEntity, StreamSummaryEntity]),
    TypeOrmConfigService,
    UsersModule,
  ],
  controllers: [StreamAnalysisController],
  providers: [StreamAnalysisService],
  exports: [],
})
export class StreamAnalysisModule {}
