/**
 * AuthService는 user를 검색하고 password 를 확인하는 작업을 합니다
 * validateUser() 메소드가 passport local strategy에서 사용되어 그 역할을 합니다. 
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginToken } from './interfaces/loginToken.interface';
import { UserLoginPayload } from './interfaces/loginUserPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // This is for local-strategy and for generating jwt token
  async validateUser(userId: string, pass: string): Promise<UserLoginPayload> {
    const user = await this.usersService.findOne(userId);

    // 꼭, bcrypt와 같은 암호화 라이브러리를 사용하여 비밀번호를 plain text로 유지하지 않고 암호화하여 사용한다.
    if (user && user.password === pass) {
      // Extracting password
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  // This is for jwt strategy
  async login(user: any): Promise<LoginToken> {
    const payload = {
      id: user.id, firstName: user.firstName, lastName: user.lastName
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
