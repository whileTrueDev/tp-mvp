import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokenEntity } from './entities/userToken.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserTokenEntity)
    private readonly userTokensRepository: Repository<UserTokenEntity>,
  ) {}

  // **********************************************
  // User Tokens 관련

  // Find User Tokens
  async findOneToken(refreshToken: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne({
      refreshToken,
    });

    return userToken;
  }

  // Refresh Token 삭제 - 로그아웃을 위해
  async removeOneToken(userId: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne(userId);
    if (!userToken) {
      throw new InternalServerErrorException('userToken waht you request to logout is not exists');
    }
    return this.userTokensRepository.remove(userToken);
  }

  // Update User Tokens
  async saveRefreshToken(
    newTokenEntity: UserTokenEntity,
  ): Promise<UserTokenEntity> {
    return this.userTokensRepository.save(newTokenEntity);
  }
}
