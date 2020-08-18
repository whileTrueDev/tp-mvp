import {
  Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req
} from '@nestjs/common';
import { LogedInExpressRequest } from '../../interfaces/logedInRequest.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@Req() req: LogedInExpressRequest): Promise<UserEntity | UserEntity[]> {
    const { userId } = req.user;
    return this.usersService.findOne(userId);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }
}
