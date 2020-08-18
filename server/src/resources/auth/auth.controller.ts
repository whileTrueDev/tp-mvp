import express from 'express';
import {
  Controller, Request, Post, UseGuards, Get
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserLoginPayload } from './interfaces/loginUserPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
