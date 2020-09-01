import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[];

  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: string): Promise<UserEntity> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cats', 'cat')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async remove(userid: string): Promise<void> {
    await this.usersRepository.delete(userid);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
