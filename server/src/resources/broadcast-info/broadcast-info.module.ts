import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/database.config';
import { BroadcastInfoService } from './broadcast-info.service';
import { BroadcastInfoController } from './broadcast-info.controller';
import { StreamCommentService } from './streamComment.service';
import { StreamCommentController } from './streamComment.controller';
import { StreamCommentVoteService } from './streamCommentVote.service';

import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { StreamVotesEntity } from './entities/streamVotes.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { UserEntity } from '../users/entities/user.entity';
import { StreamCommentsEntity } from './entities/streamComment.entity';
import { StreamCommentVoteEntity } from './entities/streamCommentVote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamsEntity, StreamSummaryEntity, StreamVotesEntity,
      PlatformAfreecaEntity, PlatformTwitchEntity, UserEntity,
      StreamCommentsEntity, StreamCommentVoteEntity,
    ]),
    TypeOrmConfigService,
  ],
  controllers: [BroadcastInfoController, StreamCommentController],
  providers: [BroadcastInfoService, StreamCommentService, StreamCommentVoteService],
  exports: [],
})
export class BroadcastInfoModule {}
