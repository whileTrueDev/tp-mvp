import {
  Controller, Post, Body, Get,
  UseGuards, UseInterceptors,
  ClassSerializerInterceptor, Req, ForbiddenException, Param, Query
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
import { UserEntity } from './entities/user.entity';
import { CertificationType, CertificationInfo } from '../../interfaces/certification.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // get request에 반응하는 router, 함수정의
  // + 본인인증에 대한 여부 변수를 포함하여 전달.
  @Get('/id')
  async findId(
    @Query() query : CertificationType,
  ): Promise<Pick<UserEntity, 'userId'>> {
    if (query.impUid) {
      const { userDI, name }: CertificationInfo = await this.authService
        .getCertificationInfo(query.impUid);
      return this.usersService.findID(name, null, userDI);
    }
    return this.usersService.findID(query.name, query.mail, null);
  }

  @Get('/password')
  async findPassword(
    @Query('impUid') impUid : string,
  ) : Promise<string> {
    const { userDI }:CertificationInfo = await this.authService.getCertificationInfo(impUid);
    return this.usersService.findPW(userDI);
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

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
