/**
 * AuthService는 user를 검색하고 password 를 확인하는 작업을 합니다
 * validateUser() 메소드가 passport local strategy에서 사용되어 그 역할을 합니다. 
 */
import bcrypt from 'bcrypt';
import {
  Injectable, HttpException, HttpStatus
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { LoginToken } from './interfaces/loginToken.interface';
import { LogedinUser, UserLoginPayload } from '../../interfaces/logedInUser.interface';
import { CertificationInfo } from '../../interfaces/certification.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // This is for local-strategy and for generating jwt token
  async validateUser(userId: string, plainPassword: string): Promise<UserLoginPayload> {
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
  async login(user: UserLoginPayload): Promise<LoginToken> {
    const payload: LogedinUser = {
      userId: user.userId, userName: user.name, roles: user.roles
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
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

      const { accessToken } = getToken.data.response.access_token; // 인증 토큰
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
        birth
      } = certificationsInfo;
      const userDI = certificationsInfo.unique_in_site;

      return {
        name,
        gender,
        birth,
        userDI
      };
    } catch (e) {
      console.error(e);
      throw new HttpException('서버오류입니다. 잠시후 다시 진행해주세요.', HttpStatus.BAD_REQUEST);
    }
  }
}
