import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserLoginPayload } from '../interfaces/loginUserPayload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // validate 함수를 오버라이딩 하여야 합니다.
  async validate(username: string, password: string): Promise<UserLoginPayload> {
    // 대부분의 validate 작업은 AuthService의 도움으로 수행됩니다.
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
