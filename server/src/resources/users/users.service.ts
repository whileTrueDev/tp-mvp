import bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CheckIdType } from '../../interfaces/certification.interface';

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

    return this.usersRepository.save({ ...user, password: hashedPassword });

    // throw new HttpException('ID is duplicated', HttpStatus.BAD_REQUEST);
  }

  // User의 ID를 찾는 동기 함수. 결과값으로는 UserEntity의 인스턴스를 반환받되, 전달하는 것은 ID이다.
  // ID가 존재하지 않으면, ID에 대한 값을 null으로 전달한다.
  async findID(name: string, mail?: string, userDI?: string) : Promise<Pick<UserEntity, 'userId'>> {
    // userDI의 존재여부에 따라서 조회방식을 분기한다.
    try {
      if (userDI) {
        const user = await this.usersRepository
          .findOne({ where: { userDI } });
        if (user) {
          return { userId: user.userId };
        }
        return { userId: null };
      }
      const user = await this.usersRepository
        .findOne({ where: { name, mail } });
      if (user) {
        return { userId: user.userId };
      }
      return { userId: null };
    } catch {
      throw new HttpException('ID is not found', HttpStatus.BAD_REQUEST);
    }
  }

  async checkID({ userId, userDI } : CheckIdType): Promise<boolean> {
    const user = await this.usersRepository
      .findOne({ where: (userDI ? { userDI } : { userId }) });
    if (user) {
      return true;
    }
    return false;
  }

  // 본인인증의 결과가 인증이 되면,  해당 계정의 패스워드 변경후, 패스워드를 보여준다.
  async findPW(userDI: string, password: string) : Promise<string> {
    const user = await this.usersRepository
      .findOne({ where: { userDI } });
    if (user) {
      // 임시번호 저장 후에 임시비밀번호 저장.
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.usersRepository
        .createQueryBuilder()
        .update(user)
        .set({
          password: hashedPassword
        })
        .where('userDI = :userDI', { userDI })
        .execute();

      return password;
    }
    throw new HttpException('ID is not found', HttpStatus.BAD_REQUEST);
  }
}
