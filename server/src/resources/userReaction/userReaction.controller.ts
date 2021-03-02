import {
  Controller, Get, Post, Body,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UserReactionService } from './userReaction.service';
import { convertIpv6ToIpv4 } from '../../utils/convertIpAddress';
import { UserReactionEntity } from './entities/userReaction.entity';

@Controller('user-reactions')
export class UserReactionController {
  constructor(
    private readonly userReactionService: UserReactionService,
  ) {}

  /** 시청자반응 목록 조회 /Get /user-reactions
   * @return UserReactionEntity[] 
   * createDate 내림차순으로 최대 10개 반환
    { id: number;
      username: string;
      ip: string;
      content: string;
      createDate: Date;}[]
   */
  @Get()
  getUserReactions(): Promise<UserReactionEntity[]> {
    return this.userReactionService.getUserReactions();
  }

  /** 시청자반응 생성 POST /user-reactions
 * 
 * @param createUserReactionDto
      { username: string;
        content: string; }
 */
  @Post()
  createUserReactions(
    @RealIP() ip: string,
    @Body() createUserReactionDto: CreateUserReactionDto,
  ): Promise<UserReactionEntity> {
    return this.userReactionService.createUserReactions(createUserReactionDto, convertIpv6ToIpv4(ip));
  }
}
