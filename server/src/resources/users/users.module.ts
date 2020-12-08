import { Module, forwardRef, ClassSerializerInterceptor } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { PlatformAfreecaEntity } from './entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from './entities/platformTwitch.entity';
import { PlatformYoutubeEntity } from './entities/platformYoutube.entity';
import { UserTokenEntity } from './entities/userToken.entity';
import { SubscribeEntity } from './entities/subscribe.entity';
import { AfreecaTargetStreamersEntity } from '../../collector-entities/afreeca/targetStreamers.entity';
import { YoutubeTargetStreamersEntity } from '../../collector-entities/youtube/targetStreamers.entity';
import { TwitchTargetStreamersEntity } from '../../collector-entities/twitch/targetStreamers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlatformAfreecaEntity,
      PlatformTwitchEntity,
      PlatformYoutubeEntity,
      UserEntity,
      UserTokenEntity,
      SubscribeEntity,
    ]),
    TypeOrmModule.forFeature([
      AfreecaTargetStreamersEntity,
      YoutubeTargetStreamersEntity,
      TwitchTargetStreamersEntity,
    ], 'WhileTrueCollectorDB'), // collectorDB Entity 연결
    forwardRef(() => AuthModule), // Resolve circular dependencies between Modules
  ],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
