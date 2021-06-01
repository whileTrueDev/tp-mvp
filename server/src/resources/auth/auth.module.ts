import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../../config/jwt.config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { YoutubeStrategy } from './strategies/youtube.strategy';
import { AfreecaLinker } from './strategies/afreeca.linker';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    forwardRef(() => UsersModule), // Resolve circular dependencies between Moduels
  ],
  providers: [
    AuthService, LocalStrategy,
    JwtStrategy, TwitchStrategy, YoutubeStrategy, AfreecaLinker, GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, AfreecaLinker],
})
export class AuthModule {}
