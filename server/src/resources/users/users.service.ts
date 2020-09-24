import bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/userToken.entity';
import { SubscribeEntity } from './entities/subscribe.entity';
import { CheckIdType } from '../../interfaces/certification.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserTokenEntity)
    private readonly userTokensRepository: Repository<UserTokenEntity>,
    @InjectRepository(SubscribeEntity)
    private readonly subscribeRepository: Repository<SubscribeEntity>,
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

  async checkID({ userId, userDI } : { userId?: string, userDI?: string }): Promise<boolean> {
    const user = await this.usersRepository
      .findOne({ where: (userDI ? { userDI } : { userId }) });
    if (user) {
      return true;
    }
    return false;
  }

  // 본인인증의 결과가 인증이 되면,  해당 계정의 패스워드를 변경한다.
  async findPW(userDI: string, password: string) : Promise<boolean> {
    try {
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
        return true;
      }
      return false;
    } catch {
      throw new HttpException('findPW error', HttpStatus.BAD_REQUEST);
    }
  }

  /*
    input   : userId (로그인한 유저 아이디) 
    output  : [{userId, subscribePerioud}, {userId, subscribePerioud} ... ]
              해당 유저가 구독한 유저 정보 리스트 {userId, subscribePerioud}
  */
  async findUserSubscribeInfo(userId: string): Promise<SubscribeEntity[]> {
    const targetUserList = await this.subscribeRepository
      .createQueryBuilder('subscribe')
      .where('subscribe.userId = :id', { id: userId })
      .getMany();

    return targetUserList;
  }

  async checkSubscribeValidation(userId: string, targetId: string): Promise<boolean> {
    const subscribeResult = await this.subscribeRepository
      .createQueryBuilder('subscribe')
      .where('subscribe.userId = :userId', { userId })
      .andWhere('subscribe.targetUserId = :targetId', { targetId })
      .getOne();

    if (subscribeResult) {
      return true;
    }

    return false;
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
  // Refresh Token 삭제 - 로그아웃을 위해
  async removeOneToken(userId: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne(userId);
    return this.userTokensRepository.remove(userToken);
  }
  // Update User Tokens
  async saveRefreshToken(
    newTokenEntity: UserTokenEntity
  ): Promise<UserTokenEntity> {
    return this.userTokensRepository.save(newTokenEntity);
  }
}
