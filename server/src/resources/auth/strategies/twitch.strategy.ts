import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Axios from 'axios';
import { VerifyCallback, Strategy } from 'passport-oauth2';
import getApiHost from '../../../utils/getApiHost';
import { PlatformTwitchEntity } from '../../users/entities/platformTwitch.entity';
import { UsersService } from '../../users/users.service';
import { TwitchProfile, TwitchProfileResponse } from '../interfaces/twitchProfile.interface';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      scope: ['user:read:email', 'user:read:broadcast', 'channel:read:subscriptions', 'analytics:read:extensions', 'analytics:read:games'],
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      callbackURL: `${getApiHost()}/auth/twitch/callback`,
    });

    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  authorizationParams(options: any): any {
    const params: {[key: string]: any} = {
      force_verify: true,
    };
    return params;
  }

  userProfile(accessToken: string, done: (err?: Error, profile?: TwitchProfile) => void): void {
    Axios.get<TwitchProfileResponse>('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': this.configService.get<string>('TWITCH_CLIENT_ID'),
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        done(null, res.data.data[0]);
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(err, 'An Error occurred during getting userprofile from twitch');
      });
  }

  // 트위치로부터 전달되는 Profile 잠시 any로.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(
    accessToken: string, refreshToken: string, profile: TwitchProfile, done: VerifyCallback,
  ): Promise<PlatformTwitchEntity> {
    // id 및 연동 데이터 적재
    return this.usersService.linkTwitch({
      twitchId: profile.id,
      twitchChannelName: profile.display_name,
      twitchStreamerName: profile.login,
      logo: profile.profile_image_url,
      refreshToken,
    });
  }
}
