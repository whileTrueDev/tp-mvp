/**
 * AuthService는 user를 검색하고 password 를 확인하는 작업을 합니다
 * validateUser() 메소드가 passport local strategy에서 사용되어 그 역할을 합니다. 
 */
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginToken } from './interfaces/loginToken.interface';
import { LogedinUser, UserLoginPayload } from '../../interfaces/logedInUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // This is for local-strategy and for generating jwt token
  async validateUser(userId: string, plainPassword: string): Promise<UserLoginPayload> {
    const user = await this.usersService.findOne(userId);

    if (user) {
      const isCorrectPass = await bcrypt.compare(plainPassword, user.password);
      if (isCorrectPass) {
        // Extracting password
        const { password, ...result } = user;

        return result;
      }
    }
    return null;
  }

  // This is for jwt strategy
  async login(user: UserLoginPayload): Promise<LoginToken> {
    const payload: LogedinUser = {
      userId: user.userId, userName: user.name, roles: user.roles
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
