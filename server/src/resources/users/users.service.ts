import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CatEntity } from '../cats/entities/cat.entity';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[];

  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CatEntity) private readonly catsRepository: Repository<CatEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  async remove(userid: string): Promise<void> {
    await this.usersRepository.delete(userid);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }

  async findCats(userId: string): Promise<CatEntity[]> {
    return this.catsRepository.find({
      owner: userId
    });
  }
}
