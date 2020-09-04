import bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: string): Promise<UserEntity> {
    const user = this.usersRepository.findOne(userId);
    return user;
  }

  async remove(userid: string): Promise<void> {
    await this.usersRepository.delete(userid);
  }

  async register(user: UserEntity): Promise<UserEntity> {
    // 비밀번호 암호화 using bcrypt
    // Github Repository => https://github.com/kelektiv/node.bcrypt.js/
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const alreadyExists = await this.findOne(user.userId);

    if (!alreadyExists) {
      return this.usersRepository.save({ ...user, password: hashedPassword });
    }
    throw new HttpException('ID is duplicated', HttpStatus.BAD_REQUEST);
  }
}
