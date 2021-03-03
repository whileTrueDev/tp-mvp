import {
  Controller, Get, Post, Body,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UserReactionService } from './userReaction.service';
import { convertIpv6ToTo4 } from '../../utils/convertIpAddress';

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
    return this.userReactionService.createUserReactions(createUserReactionDto, convertIpv6ToTo4(ip));
  }
}
