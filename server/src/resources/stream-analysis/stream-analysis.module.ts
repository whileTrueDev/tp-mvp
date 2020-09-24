import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamAnalysisController } from './stream-analysis.controller';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
// import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreamsEntity, StreamSummaryEntity]),
    TypeOrmConfigService,
    // UsersService,
  ],
  controllers: [StreamAnalysisController],
  providers: [StreamAnalysisService],
  exports: [],
})
export class StreamAnalysisModule {}
