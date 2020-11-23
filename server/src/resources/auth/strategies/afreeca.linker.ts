import Axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AfreecaPreLinker {
  private readonly AFREECA_AUTH_URL = 'https://openapi.afreecatv.com/auth/code';

  private readonly AFREECA_TOKEN_URL = 'https://openapi.afreecatv.com/auth/token';

  private AFREECA_KEY: string;

  private AFREECA_SECRET_KEY: string;

  constructor(
    private readonly configService: ConfigService,
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
      console.error(e);
      throw new InternalServerErrorException('An Error occurred during getting refreshtoken from afreecatv');
    }
  }

  /**
   * 트루포인트 유저 ID, 리프레시 토큰을 받아 TP-Afreeca연동 정보를 남기는 메소드
   * 현재 (2020.11.12) 아프리카 연동 유저의 Profile을 받지 못하므로, 연동 AfreecaId를 TP-userId로 둔다.
   * userProfile을 받을 수 있는 상황이 되면 해당 유저의 ID를 연동 Afreeca 아이디로 두도록 변경하여야 한다.
   * @param refreshToken 해당 유저의 리프레시 토큰
   * @param userId 해당 유저 Truepoint ID
   */
  async link(refreshToken: string, userId: string): Promise<void> {
    try {
      await this.usersService.linkAfreeca({
        refreshToken, afreecaId: userId,
      });
      await this.usersService.linkUserToPlatform(userId, 'afreeca', userId);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('An Error occurred during inserting afreecatv link data');
    }
  }
}