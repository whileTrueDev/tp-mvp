import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentVoteService } from './creatorCommentVote.service';
import { CreatorCommentController } from './creatorComment.controller';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { CreatorCommentVoteEntity } from './entities/creatorCommentVote.entity';
// import { CreatorCommentLikesEntity } from './entities/creatorCommentLikes.entity';
// import { CreatorCommentHatesEntity } from './entities/creatorCommentHates.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CreatorCommentsEntity, CreatorCommentVoteEntity])],
  controllers: [CreatorCommentController],
  providers: [CreatorCommentService, CreatorCommentVoteService],
})
export class CreatorCommentModule {}
