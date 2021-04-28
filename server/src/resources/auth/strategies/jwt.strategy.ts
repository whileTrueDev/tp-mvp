import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserLoginPayload, LogedinUser } from '../../../interfaces/logedInUser.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // jwt 토큰으로 만들 데이터를 반환
  async validate(payload: UserLoginPayload): Promise<LogedinUser> {
    const reqAttachTargetUser = {
      userId: payload.userId,
      userName: payload.name,
      userDI: payload.userDI,
      roles: payload.roles,
      nickName: payload.nickName,
    };
    return reqAttachTargetUser;
  }
}
