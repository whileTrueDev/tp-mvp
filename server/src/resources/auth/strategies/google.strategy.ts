import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import Axios from 'axios';
import {
  VerifyCallback,
  Strategy,
} from 'passport-google-oauth20';
import getApiHost from '../../../utils/getApiHost';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('YOUTUBE_CLIENT_ID'),
      clientSecret: configService.get<string>('YOUTUBE_CLIENT_SECRET'),
      scope: [
        'email', 'profile',
        'https://www.googleapis.com/auth/youtube', // 유튜브 계정 관리 및 보기
        // 'https://www.googleapis.com/auth/yt-analytics.readonly', // 유튜브 통계 및 분석 보기
      ],
      callbackURL: `${getApiHost()}/auth/youtube/callback`,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
