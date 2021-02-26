import { Module } from '@nestjs/common';
import { UserReactionService } from './userReaction.service';
import { UserReactionController } from './userReaction.controller';

@Module({
  controllers: [UserReactionController],
  providers: [UserReactionService],
})
export class UserReactionModule {}
