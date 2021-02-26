import {
  Controller, Get, Post, Body,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { UserReactionService } from './userReaction.service';
import { ipv6ToIpv4 } from '../../utils/convertIpAddress';

interface CreateUserReactionDto {
  nickname: string;
  content: string;
}
@Controller('user-reactions')
export class UserReactionController {
  constructor(
    private readonly userReactionService: UserReactionService,
  ) {}

  @Get()
  getUserReactions(): Promise<any> {
    return this.userReactionService.getUserReactions();
  }

  @Post()
  createUserReactions(
    @RealIP() ip: string,
    @Body() createUserReactionDto: CreateUserReactionDto,
  ): Promise<any> {
    // console.log(createUserReactionDto);
    return this.userReactionService.createUserReactions(createUserReactionDto, ipv6ToIpv4(ip));
  }
}
