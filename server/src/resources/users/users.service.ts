import bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/userToken.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserTokenEntity)
    private readonly userTokensRepository: Repository<UserTokenEntity>,
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

  // User의 ID를 찾는 동기 함수. 결과값으로는 UserEntity의 인스턴스를 반환받되, 전달하는 것은 ID이다.
  async findID(name: string, mail?: string, userDI?: string) : Promise<Pick<UserEntity, 'userId'>> {
    // userDI의 존재여부에 따라서 조회방식을 분기한다.
    if (userDI) {
      const user = await this.usersRepository
        .findOne({ where: { name, userDI } });
      if (user) {
        return { userId: user.userId };
      }
    } else {
      const user = await this.usersRepository
        .findOne({ where: { name, mail } });
      if (user) {
        return { userId: user.userId };
      }
    }
    throw new HttpException('ID is not found', HttpStatus.BAD_REQUEST);
  }

  // 본인인증의 결과가 인증이 되면,  해당 계정의 패스워드 변경후, 패스워드를 보여준다.
  async findPW(userDI: string) : Promise<string> {
    const user = await this.usersRepository
      .findOne({ where: { userDI } });
    if (user) {
      // 임시번호 저장 후에 임시비밀번호 저장.
      let password = '';

      for (let i = 0; i < 8; i += 1) {
        const lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
        if (i % 2 === 0) {
          password += String(Math.floor(Math.random() * 10));
        } else {
          password += lowerStr;
        }
      }

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

  // **********************************************
  // User Tokens 관련

  // Find User Tokens
  async findOneToken(refreshToken: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne({
      refreshToken
    });

    return userToken;
  }
  // Update User Tokens
  async saveRefreshToken(
    newTokenEntity: UserTokenEntity
  ): Promise<UserTokenEntity> {
    return this.userTokensRepository.save(newTokenEntity);
  }
}
