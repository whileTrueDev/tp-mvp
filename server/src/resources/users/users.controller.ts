import {
  Controller, Post, Body, Get,
  UseGuards, UseInterceptors,
  ClassSerializerInterceptor, Req, ForbiddenException, Param, Query, Patch
} from '@nestjs/common';
import {
  UseRoles, ACGuard,
} from 'nest-access-control';
import { LogedInExpressRequest } from '../../interfaces/logedInUser.interface';
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
    output  : [{userId, subscribePerioud}, {userId, subscribePerioud} ... ]
              해당 유저가 구독한 유저 정보 리스트 {userId, subscribePerioud}
  */
  @Get('/valid-subscribe-info')
  getUserValidSubscribeInfo(@Query('userId') userId:any) {
    return this.usersService.findUserSubscribeInfo(userId);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
