import express from 'express';
import {
  Controller, Request, Post, UseGuards, Get, Query, HttpException, HttpStatus
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserLoginPayload } from '../../interfaces/logedInUser.interface';
import { CertificationInfo } from '../../interfaces/certification.interface';
import { CheckCertificationDto } from './dto/searchIamportCertification.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: express.Request): Promise<any> {
    return this.authService.login(req.user as UserLoginPayload);
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
    if (!certificationInfo) throw new HttpException('error on server of truepoint', HttpStatus.BAD_REQUEST);
    return certificationInfo;
  }
}
