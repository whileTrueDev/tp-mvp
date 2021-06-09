import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile, VerifyCallback } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import getApiHost from '../../../utils/getApiHost';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_REST_API_KEY'),
      clientSecret: '',
      callbackURL: `${getApiHost()}/auth/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const {
      id, username, displayName, _json,
    } = profile;

    const { email } = _json.kakao_account;
    const { profile_image_url, is_default_image } = _json.kakao_account.profile;

    const user = {
      kakaoId: id,
      name: username,
      nickname: displayName,
      mail: email,
      profileImage: is_default_image ? null : profile_image_url,
      provider: 'kakao',
    };

    return user;
  }
}
