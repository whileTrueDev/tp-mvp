import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile, VerifyCallback } from 'passport-naver';
import getApiHost from '../../../utils/getApiHost';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: `${getApiHost()}/auth/naver/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const {
      id, displayName, emails, _json, name,
    } = profile;
    const user = {
      name,
      naverId: id,
      nickname: displayName,
      mail: emails[0].value,
      profileImage: _json.profile_image,
      provider: 'naver',
    };

    return user;
  }
}
