import {
  Controller, Post, Body, Get, UseInterceptors,
  ClassSerializerInterceptor, Query, Patch, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { PasswordDto } from './dto/password.dto';

import { UserEntity } from './entities/user.entity';
import { CertificationType, CertificationInfo, CheckIdType } from '../../interfaces/certification.interface';

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
    @Query('userId') userId: string
  ): Promise<Pick<UserEntity, 'nickName' | 'afreecaId' | 'youtubeId' | 'twitchId'>> {
    return this.usersService.findSubscriberInfo(userId);
  }

  // get request에 반응하는 router, 함수정의
  @Get('/id')
  async findId(
    @Query() query : CertificationType,
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
    @Query() query : CheckIdType,
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
    @Body(new ValidationPipe()) { userDI, password }: PasswordDto
  ) : Promise<boolean> {
    return this.usersService.findPW(userDI, password);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
