import { Injectable } from '@nestjs/common';

interface UserReactionData {
  id: number;
  nickname: string;
  ip: string;
  createDate: Date;
  content: string;
}
interface CreateUserReactionDto {
  nickname: string;
  content: string;
}
const userReactions: UserReactionData[] = [];

// function createUserReactionData(count = 10) {
//   const result: UserReactionData[] = [];
//   for (let i = 0; i < count; i += 1) {
//     result.push({
//       id: i,
//       nickname: `시청자${i}`,
//       ip: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
//       createDate: new Date(),
//       // content: `시청자 반응${i}입니다. 시청자반응은 50자 이내로 댓글 시청자 반응 핫한 반응 순서대로 올`,
//       content: `시청자 반응${i}입니다. `,
//     });
//   }
//   return result;
// }

@Injectable()
export class UserReactionService {
  async getUserReactions(): Promise<any> {
    return userReactions;
  }

  async createUserReactions(
    createUserReactionDto: CreateUserReactionDto,
    ip: string,
  ): Promise<any> {
    // console.log(createUserReactionDto);
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
