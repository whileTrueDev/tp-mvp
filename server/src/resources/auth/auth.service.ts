import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  Injectable, HttpException, HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { LogoutDto } from '@truepoint/shared/dist/dto/auth/logout.dto';
import { RefreshTokenData } from '../../interfaces/RefreshTokenData.interface';
import { UsersService } from '../users/users.service';
import { LoginToken } from './interfaces/loginToken.interface';
import { LogedinUser, UserLoginPayload } from '../../interfaces/logedInUser.interface';
import { CertificationInfo } from '../../interfaces/certification.interface';
import { UserEntity } from '../users/entities/user.entity';
import { TokenService } from './token.service';

// naver strategy 통해서 리턴되는 req.user
export interface NaverUserInfo{
  naverId: string;
  nickname: string;
  mail: string;
  profileImage?: string;
  provider: string;
  name: string;
}

// kakao strategy 통해 리턴되는 req.user
export interface KakaoUserInfo{
  kakaoId: string;
  name: string;
  nickname: string;
  mail: string | undefined;
  profileImage?: string;
  provider: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  // 임시 비밀번호 생성 (비밀번호 8~16자)
  public createTempPassword(length = 12): string {
    return crypto.randomBytes(20).toString('hex').slice(0, length);
  }

  private createAccessToken(payload: LogedinUser): string {
    return this.jwtService.sign({
      userId: payload.userId,
      userName: payload.userName,
      roles: payload.roles,
      userDI: payload.userDI,
      nickName: payload.nickName,
    });
  }

  private createRefreshToken(userId: string, stayLogedIn: boolean): string {
    // refresh token은 자동로그인 동의시 14일, 자동로그인 미동의시 30분의 유효기간을 가진다.
    return this.jwtService.sign({ userId, refreshSelf: stayLogedIn }, {
      expiresIn: stayLogedIn ? '14d' : '60m',
    });
  }

  /**
   * AuthService는 user를 검색하고 password 를 확인하는 작업을 합니다
   * validateUser() 메소드가 passport local strategy에서 사용되어 그 역할을 합니다. 
   */
  // This is for local-strategy and for generating jwt token
  public async validateUser(
    userId: string, plainPassword: string,
  ): Promise<UserLoginPayload> {
    const user = await this.usersService.findOne({ userId });

    if (user) {
      const isCorrectPass = await bcrypt.compare(plainPassword, user.password);
      if (isCorrectPass) {
        // Extracting password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result as UserLoginPayload;
      }
    }
    return null;
  }

  // This is for jwt strategy
  /**
   * 유저 로그인 메소드, access, refresh 토큰을 생성합니다.
   * @param user 유저정보
   * @param stayLogedIn 자동로그인(로그인상태유지) 동의 플래그 값
   */
  public async login(user: UserLoginPayload, stayLogedIn: boolean): Promise<LoginToken> {
    // access token 발급
    const accessToken = this.createAccessToken({
      userId: user.userId, userName: user.name, roles: user.roles, userDI: user.userDI, nickName: user.nickName,
    });
    // 로그인 상태 유지에 따라 다른 유지기간의 refresh token 발급
    const refreshToken = this.createRefreshToken(user.userId, stayLogedIn);
    // refresh token 적재
    await this.tokenService.saveRefreshToken({
      userId: user.userId, refreshToken,
    });
    return { accessToken, refreshToken };
  }

  // Logout = DB에서 refresh token 삭제
  public async logout({ userId }: LogoutDto): Promise<boolean> {
    const removed = await this.tokenService.removeOneToken(userId);
    if (removed) {
      return true;
    }
    return false;
  }

  // Refresh token 재발급
  public async silentRefresh(prevRefreshToken: string): Promise<LoginToken> {
    const NOW_DATE = new Date();

    // 전달받은 refresh token이 만료되었는지 확인
    // 리프레시 토큰 만료시 재로그인 필요
    let verifiedPrevRefreshToken: RefreshTokenData;
    try {
      verifiedPrevRefreshToken = await this.jwtService.verifyAsync<RefreshTokenData>(
        prevRefreshToken,
      );
    } catch (err) {
      throw new HttpException(
        'Error occurred during verifying refresh token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 토큰 스토어 (RDS - UserTokens테이블) 에 해당 refreshToken이 있는지 확인
    // 리프레시 토큰이 만료되지 않음 && 토큰테이블에 없음 -> 로그아웃 한것이므로 재로그인 필요
    const token = await this.tokenService.findOneToken(prevRefreshToken);
    if (!token) {
      throw new HttpException(
        'Error occurred during find refresh token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 유저 정보 로드
    const userInfo = await this.usersService.findOne({ userId: verifiedPrevRefreshToken.userId });
    // 새로운 accessToken, refreshToken 생성
    const newAccessToken = this.createAccessToken({
      userId: userInfo.userId,
      userName: userInfo.name,
      roles: userInfo.roles,
      userDI: userInfo.userDI,
      nickName: userInfo.nickName,
    });

    // ***************************************************************
    // refresh token 발급한지 30분 이하인 경우
    // refresh token 재발급 하지않고 기존의 refresh token 반환
    const ISSUED_DATE = new Date(verifiedPrevRefreshToken.iat * 1000);
    const issueNowDiffMinute = Math.floor((NOW_DATE.getTime() - ISSUED_DATE.getTime()) / 60000);

    if (issueNowDiffMinute < 30) {
      return { accessToken: newAccessToken, refreshToken: prevRefreshToken };
    }

    // refresh토큰 자기자신을 갱신하도록 허용한 토큰인 경우만 refresh token을 갱신
    // ( 2020. 09. 17 현재 이 경우는 (자동로그인)로그인상태유지 허용 시 )
    // from hwasurr.
    if (!verifiedPrevRefreshToken.refreshSelf) {
      // 갱신 허용되지 않은 토큰의 경우 기존의 refresh token을 반환
      return { accessToken: newAccessToken, refreshToken: prevRefreshToken };
    }
    // 새로운 refresh token 을 생성
    const newRefreshToken = this.createRefreshToken(
      userInfo.userId, verifiedPrevRefreshToken.refreshSelf,
    );
    // 새로운 refreshToken을 UserTokens에 적재
    this.tokenService.saveRefreshToken({
      userId: userInfo.userId, refreshToken: newRefreshToken,
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * 아임포트 본인인증 유저 정보 받는 메소드
   * @param impUid import UID
   */
  async getCertificationInfo(impUid: string): Promise<CertificationInfo> {
    try {
      // 인증 토큰 발급 받기
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_KEY, // REST API키
          imp_secret: process.env.IMP_SECRET, // REST API Secret
        },
      });
      const accessToken = getToken.data.response.access_token; // 인증 토큰
      // imp_uid로 인증 정보 조회
      const getCertifications = await axios({
        url: `https://api.iamport.kr/certifications/${impUid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
      });
      const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보
      // 인증정보에 대한 데이터를 저장하거나 사용한다.
      const {
        name,
        gender,
        birthday,
      } = certificationsInfo;
      const userDI = certificationsInfo.unique_in_site;

      return {
        name,
        gender,
        birth: birthday,
        userDI,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        '서버오류입니다. 잠시후 다시 진행해주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *******************************************
  // 네이버 로그인
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async naverLogin(user: NaverUserInfo): Promise<{
    user: UserEntity,
    accessToken: string,
    refreshToken: string
  }> {
    // provider = naver 이고 naverId가 user.naverId인 값으로 유저 찾기
    const existUser = await this.usersService.findUserByProviderId('naver', user.naverId);
    if (existUser) {
      // 있으면 로그인처리
      const {
        accessToken, refreshToken,
      } = await this.login(existUser, false);
      return { user: existUser, accessToken, refreshToken };
    }
    // 없으면 회원가입 후 로그인 처리
    const newUser = await this.usersService.registNaverUser(user);
    const {
      accessToken, refreshToken,
    } = await this.login(newUser, false);
    return { user: newUser, accessToken, refreshToken };
  }

  // *******************************************
  // 카카오 로그인
  async kakaoLogin(user: KakaoUserInfo): Promise<{ user: UserEntity; accessToken: string; refreshToken: string; }> {
    const existUser = await this.usersService.findUserByProviderId('kakao', user.kakaoId);
    if (existUser) {
      const {
        accessToken, refreshToken,
      } = await this.login(existUser, false);
      return { user: existUser, accessToken, refreshToken };
    }

    const newUser = await this.usersService.registKakaoUser(user);
    const {
      accessToken, refreshToken,
    } = await this.login(newUser, false);
    return { user: newUser, accessToken, refreshToken };
  }

  // adminpage 인증
  async validateAdmin(userId: string, password: string): Promise<boolean> {
    try {
      const user = await this.usersService.findOne({ userId });
      if (!user || user.roles !== 'admin') return false;
      return bcrypt.compare(password, user.password);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in validate admin');
    }
  }
}
