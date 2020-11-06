import {
  Controller, Post, Body, Get, UseInterceptors,
  ClassSerializerInterceptor, Query, Patch, UseGuards,
} from '@nestjs/common';
// DTOs
import { CreateUserDto } from '@truepoint/shared/dist/dto/users/createUser.dto';
import { PasswordDto } from '@truepoint/shared/dist/dto/users/password.dto';
import { SubscribeUsers } from '@truepoint/shared/dist/dto/users/subscribeUsers.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

import { UserEntity } from './entities/user.entity';
import { CertificationType, CertificationInfo, CheckIdType } from '../../interfaces/certification.interface';
import { SubscribeEntity } from './entities/subscribe.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // 구독자가 피구독자의 데이터에 접근하는 경우
  // 프로필 데이터 (채널 연동 정보, 닉네임)
  @Get()
  @UseGuards(JwtAuthGuard)
  async findSubscriberInfo(
    @Query('userId') userId: string,
  ): Promise<Pick<UserEntity, 'nickName' | 'afreecaId' | 'youtubeId' | 'twitchId'>> {
    return this.usersService.findSubscriberInfo(userId);
  }

  // get request에 반응하는 router, 함수정의
  @Get('/id')
  async findId(
    @Query() query: CertificationType,
  ): Promise<Pick<UserEntity, 'userId'>> {
    if (query.impUid) {
      const { userDI }: CertificationInfo = await this.authService
        .getCertificationInfo(query.impUid);
      return this.usersService.findID(null, null, userDI);
    }
    return this.usersService.findID(query.name, query.mail, null);
  }

  // 1. ID 값을 통해서 ID의 존재여부 확인.
  // 2. userDI 값을 통해서 ID의 존재여부 확인.
  @Get('/check-id')
  async checkId(
    @Query() query: CheckIdType,
  ): Promise<boolean> {
    if (query.impUid) {
      const { userDI }: CertificationInfo = await this.authService
        .getCertificationInfo(query.impUid);
      return this.usersService.checkID({ userDI });
    }
    return this.usersService.checkID(query);
  }

  @Patch('/password')
  async findPassword(
    @Body(new ValidationPipe()) { userDI, password }: PasswordDto,
  ): Promise<boolean> {
    return this.usersService.findPW(userDI, password);
  }

  // @Get('/:id')
  // @UseGuards(JwtAuthGuard, ACGuard)
  // @UseRoles({ resource: 'profile', action: 'read', possession: 'own' })
  // @UseInterceptors(ClassSerializerInterceptor)
  // async find(
  //   @Param('id') id: string,
  //   @Req() req: LogedInExpressRequest,
  // ): Promise<UserEntity> {
  //   const { user } = req;
  //   if (user.userId === id) {
  //     return this.usersService.findOne(user.userId);
  //   }
  //   throw new ForbiddenException();
  // }

  /*
    input   : userId (로그인한 유저 아이디) 
    output  : [{userId, targetUserId, startAt, endAt}, {userId, targetUserId, startAt, endAt} ... ]
  */
  @Get('/subscribe-users')
  @UseGuards(JwtAuthGuard)
  getUserValidSubscribeInfo(
    @Query(new ValidationPipe()) subscribeUsersRequest: SubscribeUsers,
  ): Promise<{validUserList: SubscribeEntity[]; inValidUserList: SubscribeEntity[]}> {
    return this.usersService.findUserSubscribeInfo(subscribeUsersRequest.userId);
  }

  /*
    admin page 에서의 요청만 수락하도록 하는 로직이 필요
    input   : empty
    output  : [userId1, userId2, ... ]
  */
  @Get('/id-list')
  getAllUserIdList(): Promise<{userId: string}[]> {
    return this.usersService.findAllUserList();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
