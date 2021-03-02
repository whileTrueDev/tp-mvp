import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReactionService } from './userReaction.service';
import { UserReactionController } from './userReaction.controller';
import { UserReactionEntity } from './entities/userReaction.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    UserReactionEntity,
  ])],
  controllers: [UserReactionController],
  providers: [UserReactionService],
})
export class UserReactionModule {}
