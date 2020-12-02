import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Axios from 'axios';
import { VerifyCallback, Strategy } from 'passport-google-oauth20';
import getApiHost from '../../../utils/getApiHost';
import { UsersService } from '../../users/users.service';

@Injectable()
export class YoutubeStrategy extends PassportStrategy(Strategy, 'google') {
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
        // 'https://www.googleapis.com/auth/yt-analytics.readonly',
      ],
      callbackURL: `${getApiHost()}/auth/youtube/callback`,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  authorizationParams(options: any): any {
    // refresh token을 받고자 할 때, 파라미터 access_type: offline, prompt: consent 를 추가하여야만 함.
    // google strategy에서 authenticate 함수의 두번째 인자로 config를 받아 구글에 인증 요청시 함께 요청함.
    // 하지만 nestjs/passport 에서는 authenticate 미들웨어를 라우터에 달아두는 방식이 아니므로
    // authentication 미들웨어에 두번째 인자로 넣어줄 적절한 config를 넣어줄 수가 없음.
    // authorizationParams 메소드를 오버라이딩 하는 방법을 통해 해결
    // 참고: https://github.com/nestjs/passport/issues/57
    return Object.assign(options, { access_type: 'offline', prompt: 'consent', include_granted_scopes: true });
  }

  // 유튜브로부터 전달되는 정보
  async validate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    accessToken: string, refreshToken: string, profile: any, done: VerifyCallback,
  ): Promise<any> {
    const googleInfo = profile._json;

    // 유튜브 채널 정보 가져오기
    await Axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: { part: 'snippet,id', mine: true },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (res) => {
        const youtubeChannelInfo = res.data.items[0];
        // 연동 구글 / 유튜브 채널 정보를 적재 하여 연동
        await this.usersService.linkYoutube({
          refreshToken,
          googleId: googleInfo.sub,
          googleEmail: googleInfo.email,
          googleLogo: googleInfo.picture.replace('/s96-', '/s{size}-'),
          googleName: googleInfo.name,
          youtubeId: youtubeChannelInfo.id,
          youtubeTitle: youtubeChannelInfo.snippet.title,
          youtubeLogo: youtubeChannelInfo.snippet.thumbnails.default.url.replace('=s88-', '=s{size}-'),
          youtubePublishedAt: youtubeChannelInfo.snippet.publishedAt,
        }).then((result) => done(null, result));
      })
      .catch((err) => {
        console.error('error occurred during getting youtube channel data');
        done(err);
      });
  }
}
