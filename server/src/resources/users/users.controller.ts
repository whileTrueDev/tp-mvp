import {
  Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req
} from '@nestjs/common';
import { LogedInExpressRequest } from '../../interfaces/logedInRequest.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { CatEntity } from '../cats/entities/cat.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@Query('id') id: string): Promise<UserEntity | UserEntity[]> {
    if (id) {
      return this.usersService.findOne(id);
    }
    return this.usersService.findAll();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get('cats')
  @UseGuards(JwtAuthGuard)
  async findCats(@Req() req: LogedInExpressRequest): Promise<CatEntity[]> {
    return this.usersService.findCats(req.user.userId);
  }
}
