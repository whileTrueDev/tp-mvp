import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { Repository } from 'typeorm';
import { UserReactionEntity } from './entities/userReaction.entity';

@Injectable()
export class UserReactionService {
  constructor(
    @InjectRepository(UserReactionEntity)
    private readonly userReactionRepository: Repository<UserReactionEntity>,
  ) {}

  async getUserReactions(): Promise<UserReactionEntity[]> {
    return this.userReactionRepository.find({
      order: { createDate: 'DESC' },
      take: 10,
    });
  }

  async createUserReactions(
    createUserReactionDto: CreateUserReactionDto,
    ip: string,
  ): Promise<UserReactionEntity> {
    const newReaction = {
      ...createUserReactionDto,
      ip,
    };
    try {
      const reaction = await this.userReactionRepository.save(newReaction);
      return reaction;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error in creating user reaction');
    }
  }
}
