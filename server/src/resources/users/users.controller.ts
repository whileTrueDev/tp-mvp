import {
  Controller, Post, Body, Get, UseInterceptors,
  ClassSerializerInterceptor, Query, Patch, UseGuards, Req, ForbiddenException, Delete,
} from '@nestjs/common';
// DTOs
import { CreateUserDto } from '@truepoint/shared/dist/dto/users/createUser.dto';
import { PasswordDto } from '@truepoint/shared/dist/dto/users/password.dto';
import { SubscribeUsers } from '@truepoint/shared/dist/dto/users/subscribeUsers.dto';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

import { UserEntity } from './entities/user.entity';
import { CertificationType, CertificationInfo, CheckIdType } from '../../interfaces/certification.interface';
import { SubscribeEntity } from './entities/subscribe.entity';
import { LogedInExpressRequest } from '../../interfaces/logedInUser.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 유저 정보 열람 GET 컨트롤러
   * @param req user를 포함한 리퀘스트 객체
   * @param userId 유저 정보를 열람하고자 하는 유저의 아이디
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findUser(
    @Req() req: LogedInExpressRequest,
    @Query('userId') userId: string,
  ): Promise<UserEntity> {
    if (userId) return this.usersService.findOne(userId);
    return this.usersService.findOne(req.user.userId);
  }

  @Get('profile-images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findUserProfileImages(
    @Req() req: LogedInExpressRequest,
    @Query('userId') userId: string,
  ): Promise<ProfileImages> {
    if (userId) return this.usersService.findOneProfileImage(userId);
    return this.usersService.findOneProfileImage(req.user.userId);
  }

  /**
   * 유저 정보 변경 PATCH 컨트롤러
   * @param req user를 포함한 리퀘스트 객체
   * @param updateUserDto 변경할 유저 정보 Data Transfer Object
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Req() req: LogedInExpressRequest,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<number> {
    if (req.user.userId && req.user.userId === updateUserDto.userId) {
      return this.usersService.updateOne(updateUserDto);
    }
    // 로그인 되어있지 않거나, 로그인한 유저와 변경요청한 유저가 다른 경우
    throw new ForbiddenException('Forbidden for you');
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteUser(
    @Req() req: LogedInExpressRequest,
  ): Promise<number> {
    const { userId } = req.user;

    // 유저 정보 삭제
    const affected = await this.usersService.remove(userId);

    // 유저 로그아웃 (액세스/리프레시 토큰 삭제)
    await this.authService.logout(req.user);

    return affected;
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
    return this.usersService.updatePW(userDI, password);
  }

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
    관리자 페이지 개인 알림 보낼 유저 리스트 조회
    input   : empty
    output  : [userId1, userId2, ... ]
  */
  @Get('/id-list')
  getAllUserIdList(): Promise<{userId: string}[]> {
    return this.usersService.findAllUserList();
  }

  // 회원 가입
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
