import express from 'express';
import {
  Controller, Request, Post, UseGuards, Get, Query,
  HttpException, HttpStatus, Res
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { UserLoginPayload } from '../../interfaces/logedInUser.interface';
import { CertificationInfo } from '../../interfaces/certification.interface';
import { CheckCertificationDto } from './dto/checkCertification.dto';
import { LoginTokenExports } from './interfaces/loginToken.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  // 로그인 컨트롤러
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: express.Request,
    @Res() res: express.Response,
  ): Promise<LoginTokenExports> {
    const {
      accessToken, refreshToken,
    } = await this.authService.login(req.user as UserLoginPayload);

    // Set-Cookie 헤더로 refresh_token을 담은 HTTP Only 쿠키를 클라이언트에 심는다.
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  // 토큰 새로고침 컨트롤러
  @Post('silent-refresh')
  async silentRefresh(
    @Request() req: express.Request,
    @Res() res: express.Response,
  ): Promise<LoginTokenExports> {
    // 헤더로부터 refresh token 비구조화 할당
    const { refresh_token: prevRefreshToken } = req.cookies;
    const {
      accessToken, refreshToken
    } = await this.authService.silentRefresh(prevRefreshToken);

    // 새로운 HTTP only refreshToken을 쿠키로 설정
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    // 새로운 accessToken을 반환
    res.send({ access_token: accessToken });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: express.Request) {
    return req.user;
  }

  @Get('certification')
  async checkCertification(
    @Query(new ValidationPipe()) checkCertificationDto: CheckCertificationDto
  ): Promise<CertificationInfo> {
    const certificationInfo = await this.authService
      .getCertificationInfo(checkCertificationDto.impUid);
    if (!certificationInfo) throw new HttpException('User not exists in truepoint', HttpStatus.BAD_REQUEST);
    return certificationInfo;
  }
}
