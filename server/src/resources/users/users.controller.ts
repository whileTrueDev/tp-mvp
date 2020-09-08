import {
  Controller, Post, Body, Get,
  UseGuards, UseInterceptors,
  ClassSerializerInterceptor, Req, ForbiddenException, Param
} from '@nestjs/common';
import {
  UseRoles, ACGuard,
} from 'nest-access-control';
import { LogedInExpressRequest } from '../../interfaces/logedInUser.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard, ACGuard)
  @UseRoles({ resource: 'profile', action: 'read', possession: 'own' })
  @UseInterceptors(ClassSerializerInterceptor)
  async find(
    @Param('id') id: string,
    @Req() req: LogedInExpressRequest,
  ): Promise<UserEntity> {
    const { user } = req;
    if (user.userId === id) {
      return this.usersService.findOne(user.userId);
    }
    throw new ForbiddenException();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.register(createUserDto);
  }
}
