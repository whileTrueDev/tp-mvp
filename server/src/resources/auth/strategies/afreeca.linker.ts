import Axios from 'axios';
import {
  forwardRef, Inject, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AfreecaLinker {
  private readonly AFREECA_AUTH_URL = 'https://openapi.afreecatv.com/auth/code';

  private readonly AFREECA_TOKEN_URL = 'https://openapi.afreecatv.com/auth/token';

  private AFREECA_KEY: string;

  private AFREECA_SECRET_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    this.AFREECA_KEY = configService.get<string>('AFREECA_KEY');
    this.AFREECA_SECRET_KEY = configService.get<string>('AFREECA_SECRET_KEY');
  }

  /**
   * 아프리카TV로 로그인 요청, code를 포함한 url을 받는 메소드  
   * @description
   * 현재 브라우저에 아프리카TV로그인이 되어있으면 곧바로 auth/afreeca/callback으로 authorization code를 전송합니다.  
   * 현재 브라우저에 아프리카TV로그인이 되어있지 않으면 로그인 ID/PW 입력창에서 입력 이후, 로그인 성공시 auth/afreeca/callback으로 authorization code를 전송합니다.  
   */
  async getAfreecaLoginUrl(): Promise<string> {
    try {
      const response = await Axios.get(this.AFREECA_AUTH_URL, {
        params: { client_id: this.AFREECA_KEY },
      });

      return response.request.res.responseUrl;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('An Error occurred during getting afreeca login url');
    }
  }

  /**
   * 받아온 코드값을 기반으로 accessToken, refreshToken을 받아와 반환하는 메소드
   * @param authorizationCode /auth/code 요청으로 받아온 code 값
   */
  async getTokens(authorizationCode: string): Promise<any> {
    try {
      const response = await Axios.post(this.AFREECA_TOKEN_URL, {
        grant_type: 'authorization_code',
        client_id: this.AFREECA_KEY,
        client_secret: this.AFREECA_SECRET_KEY,
        code: authorizationCode,
      });

      const { access_token: accessToken, refresh_token: refreshToken } = response.data;
      if (!refreshToken || !accessToken) {
        throw new InternalServerErrorException('An Error occurred during getting refresh/access token from afreecatv');
      }
      return { refreshToken, accessToken };
    } catch (e) {
      console.error('An Error occurred during getting refreshtoken from afreecatv', e.message);
      throw new InternalServerErrorException('An Error occurred during getting refreshtoken from afreecatv');
    }
  }

  /**
   * 리프레시토큰을 통해 새로 갱신한 액세스 토큰을 받아와 반환하는 메소드
   * @param refreshToken 리프레시 토큰
   */
  async refresh(refreshToken: string): Promise<{
    accessToken: string; refreshToken: string;
  }> {
    try {
      const response = await Axios.post(this.AFREECA_TOKEN_URL, {
        grant_type: 'refresh_token',
        client_id: this.AFREECA_KEY,
        client_secret: this.AFREECA_SECRET_KEY,
        refresh_token: refreshToken,
      });
      const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      console.error('An Error occurred during refreshing afreecatv access token', e.message);
      throw new InternalServerErrorException('An Error occurred during refreshing afreecatv access token');
    }
  }

  /**
   * 트루포인트 유저 ID, 리프레시 토큰을 받아 TP-Afreeca연동 정보를 남기는 메소드
   * 현재 (2020.11.12) 아프리카 연동 유저의 Profile을 받지 못하므로, 연동 AfreecaId를 TP-userId로 둔다.
   * userProfile을 받을 수 있는 상황이 되면 해당 유저의 ID를 연동 Afreeca 아이디로 두도록 변경하여야 한다. by hwasurr
   * @param refreshToken 해당 유저의 리프레시 토큰
   * @param userId 해당 유저 Truepoint ID
   */
  async link(refreshToken: string, userId: string): Promise<void> {
    await this.usersService.linkAfreeca({
      refreshToken, afreecaId: userId,
    });
    // entity 변경으로 제거된 메서드. by hwasurr 210420 -> 연동 기능 필요할 때 새롭게 만드는 것이 더 좋을 듯.
    // await this.usersService.linkUserToPlatform(userId, 'afreeca', userId);
  }
}
