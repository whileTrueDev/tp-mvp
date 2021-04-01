import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorCommentService } from './creatorComment.service';
import { CreatorCommentLikeService } from './creatorCommentLike.service';
import { CreatorCommentController } from './creatorComment.controller';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { CreatorCommentLikesEntity } from './entities/creatorCommentLikes.entity';
import { CreatorCommentHatesEntity } from './entities/creatorCommentHates.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CreatorCommentsEntity, CreatorCommentLikesEntity, CreatorCommentHatesEntity])],
  controllers: [CreatorCommentController],
  providers: [CreatorCommentService, CreatorCommentLikeService],
})
export class CreatorCommentModule {}
