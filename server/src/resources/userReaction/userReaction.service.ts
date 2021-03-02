import { Injectable } from '@nestjs/common';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';

interface UserReactionData {
  id: number;
  ip: string;
  username: string;
  createDate: Date;
  content: string;
}

const userReactions: UserReactionData[] = [];
@Injectable()
export class UserReactionService {
  async getUserReactions(): Promise<any> {
    return userReactions.slice(0, 10);
  }

  async createUserReactions(
    createUserReactionDto: CreateUserReactionDto,
    ip: string,
  ): Promise<any> {
    const newReaction = {
      ...createUserReactionDto,
      ip,
      createDate: new Date(),
      id: userReactions.length + 1,
    };
    userReactions.unshift(newReaction);
    return newReaction;
  }
}
