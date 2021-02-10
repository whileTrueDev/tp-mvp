import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityReplyService } from './communityReply.service';
import { CommunityBoardController } from './communityBoard.controller';
import { CommunityPostEntity } from './entities/community-post.entity';
import { CommunityReplyEntity } from './entities/community-reply.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    CommunityPostEntity,
    CommunityReplyEntity,
  ])],
  controllers: [CommunityBoardController],
  providers: [CommunityBoardService, CommunityReplyService],
})
export class CommunityBoardModule {}
