import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService } from '../../config/jwt.config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { YoutubeStrategy } from './strategies/youtube.strategy';
import { AfreecaLinker } from './strategies/afreeca.linker';
import { UserTokenEntity } from './entities/userToken.entity';
import { EmailVerificationCodeEntity } from './entities/emailVerification.entity';
import { EmailVerificationService } from './emailVerification.service';
import { NaverStrategy } from './strategies/naver.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    forwardRef(() => UsersModule), // Resolve circular dependencies between Moduels
    TypeOrmModule.forFeature([
      EmailVerificationCodeEntity,
      UserTokenEntity,
    ]),
  ],
  providers: [
    AuthService, LocalStrategy, EmailVerificationService,
    JwtStrategy, TwitchStrategy, YoutubeStrategy, AfreecaLinker,
    NaverStrategy, KakaoStrategy, TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AfreecaLinker, EmailVerificationService],
})
export class AuthModule {}
