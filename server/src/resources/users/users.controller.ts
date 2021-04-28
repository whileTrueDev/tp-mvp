import {
  Body,
  ClassSerializerInterceptor, Controller,
  Delete, Get,
  Param, Patch, Post,
  Query, Req, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '@truepoint/shared/dist/dto/users/createUser.dto';
import { PasswordDto } from '@truepoint/shared/dist/dto/users/password.dto';
// DTOs
import { RegisterUserByAdminDto } from '@truepoint/shared/dist/dto/users/registerUserByAdminDto.dto';
import { SubscribeUsers } from '@truepoint/shared/dist/dto/users/subscribeUsers.dto';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { BriefInfoDataResType } from '@truepoint/shared/dist/res/BriefInfoData.interface';
import { ChannelNames } from '@truepoint/shared/dist/res/ChannelNames.interface';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CertificationInfo, CertificationType, CheckIdType } from '../../interfaces/certification.interface';
import { LogedInExpressRequest } from '../../interfaces/logedInUser.interface';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { AuthService } from '../auth/auth.service';
import { SubscribeEntity } from './entities/subscribe.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

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
    @Query('creatorId') creatorId: string,
  ): Promise<UserEntity> {
    if (userId) return this.usersService.findOne({ userId });
    if (!userId && creatorId) return this.usersService.findOne({ creatorId });
    return this.usersService.findOne({ userId: req.user.userId });
  }

  /**
   * 연동된 플랫폼 프로필 이미지 열람 GET 컨트롤러
   * @param req user 정보를 포함한 리퀘스트 객체
   * @param userId 연동된 플랫폼 프로필 이미지를 열람하고자 하는 유저 아이디
   */
  @Get('profile-images')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findUserProfileImages(
    @Req() req: LogedInExpressRequest,
    @Query('userId') userId: string,
  ): Promise<ProfileImages> {
    if (userId) return this.usersService.findOneProfileImage(userId);
    return this.usersService.findOneProfileImage(req.user.userId);
  }

  /**
   * 연동된 플랫폼 닉네임/채널명을 열람 GET 컨트롤러
   * @param req user 정보를 포함한 리퀘스트 객체
   * @param userId 연동된 플랫폼 닉네임/채널명을 열람하고자 하는 유저 아이디
   */
  @Get('platform-names')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findLinkedChannelNames(
    @Req() req: LogedInExpressRequest,
    @Query('userId') userId: string,
  ): Promise<ChannelNames> {
    if (userId) return this.usersService.findChannelNames(userId);
    return this.usersService.findChannelNames(req.user.userId);
  }

  /**
   * 유저 정보 변경 PATCH 컨트롤러
   * @param req user를 포함한 리퀘스트 객체
   * @param updateUserDto 변경할 유저 정보 Data Transfer Object
   */
  @Patch()
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Req() req: LogedInExpressRequest,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateOne(updateUserDto);
    // 로그인 되어있지 않아도 변경 가능
    //   if (req.user.userId && req.user.userId === updateUserDto.userId) {
    //   return this.usersService.updateOne(updateUserDto);
    // }
    // 로그인 되어있지 않거나, 로그인한 유저와 변경요청한 유저가 다른 경우
    // throw new ForbiddenException('Forbidden for you');
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
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
  getAllUserIdList(): Promise<UserEntity[]> {
    return this.usersService.findAllUserList();
  }

  /**
   * 관리자 페이지 내 이용자db 정보 조회 탭에서 사용
   * output : [{nickName, userId, recentBroadcastDate, averageViewer}...]
   */
  @Get('/brief-info-list')
  getAllUserBriefInfoList(): Promise<BriefInfoDataResType> {
    return this.usersService.getAllUserBriefInfoList();
  }

  /**
   * 유투브 편집점 페이지 편집점 제공 목록 요청
   * GET /users/highlight-point-list/:platform
   * 플랫폼에 따라 최근 방송 종료순으로 
   * 크리에이터 활동명, userId, 최근방송제목, 최근방송종료시간, 플랫폼 정보를 반환한다
   * 
   * @param platform 'afreeca' | 'twitch'
   * 
   * @return EditingPointListResType[]
   * {   
   *  creatorId: string, // 크리에이터 ID(아프리카아이디 || 트위치아이디)
      platform: string, // 플랫폼 'afreeca' | 'twitch'
      userId: string,   // userId
      title: string,   // 가장 최근 방송 제목
      endDate: Date,   // 가장 최근 방송의 종료시간
      nickname: string // 크리에이터 활동명
   * }[]
   */
  @Get('/highlight-point-list/:platform')
  getHighlightPointList(
    @Param('platform') platform: 'afreeca'|'twitch',
  ): Promise<any[]> {
    return this.usersService.getHighlightPointList(platform);
  }

  // 회원 가입
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }

  @Post('/byadmin')
  async registerUserByAdmin(
    @Body(ValidationPipe) registerUserByAdminDto: RegisterUserByAdminDto,
  ): Promise<any> {
    return this.usersService.registerByAdmin(registerUserByAdminDto);
  }
}
