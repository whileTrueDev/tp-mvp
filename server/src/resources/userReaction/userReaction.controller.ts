import {
  Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UpdateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/updateUserReaction.dto';
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
   * 가장 최신 시청자반응을 createDate 오름차순으로 최대 10개 반환
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

  /** 
   * 시청자반응 생성 POST /user-reactions
   * @param createUserReactionDto
        { username: string;
          content: string; }
   */
  @Post()
  @UsePipes(new ValidationPipe())
  createUserReactions(
    @RealIP() ip: string,
    @Body() createUserReactionDto: CreateUserReactionDto,
  ): Promise<UserReactionEntity> {
    return this.userReactionService.createUserReactions(createUserReactionDto, convertIpv6ToIpv4(ip));
  }

  /**
   * 시청자반응 수정 PUT /user-reactions/:id
   * @param id 수정할 userReaction의 id
   * @param updateUserReactionDto 수정할 시청자 반응의 내용 {content: string}
   */
  @Put('/:id')
  @UsePipes(new ValidationPipe())
  updateUserReaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserReactionDto: UpdateUserReactionDto,
  ): Promise<any> {
    return this.userReactionService.updateUserReaction(id, updateUserReactionDto);
  }

  /**
   * 시청자반응 삭제 DELETE /user-reactions/:id
   * @param id 삭제할 userReaction 의 id
   * @return 삭제 성공시 true 만 반환
   */
  @Delete('/:id')
  deleteUserReaction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.userReactionService.deleteUserReaction(id);
  }
}
