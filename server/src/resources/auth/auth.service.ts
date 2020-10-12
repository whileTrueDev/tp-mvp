import bcrypt from 'bcrypt';
import {
  Injectable, HttpException, HttpStatus
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { RefreshTokenData } from '../../interfaces/RefreshTokenData.interface';
import { UsersService } from '../users/users.service';
import { LoginToken } from './interfaces/loginToken.interface';
import { LogedinUser, UserLoginPayload } from '../../interfaces/logedInUser.interface';
import { CertificationInfo } from '../../interfaces/certification.interface';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private createAccessToken(payload: LogedinUser): string {
    return this.jwtService.sign({
      userId: payload.userId,
      userName: payload.userName,
      roles: payload.roles,
      userDI: payload.userDI,
    });
  }

  private createRefreshToken(userId: string, stayLogedIn: boolean): string {
    // refresh token은 자동로그인 동의시 14일, 자동로그인 미동의시 30분의 유효기간을 가진다.
    return this.jwtService.sign({ userId, refreshSelf: stayLogedIn }, {
      expiresIn: stayLogedIn ? '14d' : '30m',
    });
  }

  /**
   * AuthService는 user를 검색하고 password 를 확인하는 작업을 합니다
   * validateUser() 메소드가 passport local strategy에서 사용되어 그 역할을 합니다. 
   */
  // This is for local-strategy and for generating jwt token
  public async validateUser(
    userId: string, plainPassword: string
  ): Promise<UserLoginPayload> {
    const user = await this.usersService.findOne(userId);

    if (user) {
      const isCorrectPass = await bcrypt.compare(plainPassword, user.password);
      if (isCorrectPass) {
        // Extracting password
        const { password, ...result } = user;

        return result;
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
      userId: user.userId, userName: user.name, roles: user.roles, userDI: user.userDI
    });
    // 로그인 상태 유지에 따라 다른 유지기간의 refresh token 발급
    const refreshToken = this.createRefreshToken(user.userId, stayLogedIn);
    // refresh token 적재
    this.usersService.saveRefreshToken({
      userId: user.userId, refreshToken
    });
    return { accessToken, refreshToken };
  }

  // Logout = DB에서 refresh token 삭제
  public async logout({ userId }: LogoutDto): Promise<boolean> {
    const removed = await this.usersService.removeOneToken(userId);
    if (removed) {
      return true;
    }
    return false;
  }

  // Refresh token 재발급
  public async silentRefresh(prevRefreshToken: string): Promise<LoginToken> {
    const NOW_DATE = new Date();

    // 전달받은 refresh token이 만료되었는지 확인
    let verifiedPrevRefreshToken: RefreshTokenData;
    try {
      verifiedPrevRefreshToken = await this.jwtService.verifyAsync<RefreshTokenData>(
        prevRefreshToken
      );
    } catch (err) {
      throw new HttpException(
        'Error occurred during verifying refresh token',
        HttpStatus.BAD_REQUEST
      );
    }

    // 토큰 스토어 (RDS - UserTokens테이블) 에 해당 refreshToken이 있는지 확인
    const token = await this.usersService.findOneToken(prevRefreshToken);
    if (!token) {
      throw new HttpException(
        'Error occurred during find refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    // 유저 정보 로드
    const userInfo = await this.usersService.findOne(verifiedPrevRefreshToken.userId);
    // 새로운 accessToken, refreshToken 생성
    const newAccessToken = this.createAccessToken({
      userId: userInfo.userId,
      userName: userInfo.name,
      roles: userInfo.roles,
      userDI: userInfo.userDI
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
      userInfo.userId, verifiedPrevRefreshToken.refreshSelf
    );
    // 새로운 refreshToken을 UserTokens에 적재
    this.usersService.saveRefreshToken({
      userId: userInfo.userId, refreshToken: newRefreshToken
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async getCertificationInfo(impUid : string): Promise<CertificationInfo> {
    try {
      // 인증 토큰 발급 받기
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_KEY, // REST API키
          imp_secret: process.env.IMP_SECRET // REST API Secret
        }
      });
      const accessToken = getToken.data.response.access_token; // 인증 토큰
      // imp_uid로 인증 정보 조회
      const getCertifications = await axios({
        url: `https://api.iamport.kr/certifications/${impUid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: accessToken } // 인증 토큰 Authorization header에 추가
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
        userDI
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        '서버오류입니다. 잠시후 다시 진행해주세요.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
