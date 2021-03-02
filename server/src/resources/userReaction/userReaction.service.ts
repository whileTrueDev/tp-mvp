import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UpdateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/updateUserReaction.dto';
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

  async updateUserReaction(id: number, updateUserReactionDto: UpdateUserReactionDto): Promise<UserReactionEntity> {
    const data = await this.findOneUserReaction(id);
    try {
      const newData = await this.userReactionRepository.save({
        ...data,
        ...updateUserReactionDto,
      });
      return newData;
    } catch (error) {
      throw new InternalServerErrorException('error in updating user reaction');
    }
  }

  async deleteUserReaction(id: number): Promise<boolean> {
    const data = await this.findOneUserReaction(id);
    try {
      await this.userReactionRepository.remove(data);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('error in updating user reaction');
    }
  }

  async findOneUserReaction(id: number): Promise<UserReactionEntity> {
    const data = await this.userReactionRepository.findOne({ id });
    if (!data) {
      throw new NotFoundException(`no data with id ${id}`);
    }
    return data;
  }
}
