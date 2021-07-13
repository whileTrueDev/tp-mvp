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
import { SubscribeEntity } from './entities/subscribe.entity';
import { AfreecaTargetStreamersEntity } from '../../collector-entities/afreeca/targetStreamers.entity';
import { YoutubeTargetStreamersEntity } from '../../collector-entities/youtube/targetStreamers.entity';
import { TwitchTargetStreamersEntity } from '../../collector-entities/twitch/targetStreamers.entity';
import { AfreecaActiveStreamsEntity } from '../../collector-entities/afreeca/activeStreams.entity';
import { StreamsEntity } from '../stream-analysis/entities/streams.entity';
import { S3Module } from '../s3/s3.module';
import { UserDetailEntity } from './entities/userDetail.entity';
import { UserPropertiesService } from './userProperties.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlatformAfreecaEntity,
      PlatformTwitchEntity,
      PlatformYoutubeEntity,
      UserEntity,
      UserDetailEntity,
      SubscribeEntity,
      StreamsEntity,
    ]),
    TypeOrmModule.forFeature([
      AfreecaTargetStreamersEntity,
      AfreecaActiveStreamsEntity,
      YoutubeTargetStreamersEntity,
      TwitchTargetStreamersEntity,
    ], 'WhileTrueCollectorDB'), // collectorDB Entity 연결
    forwardRef(() => AuthModule), // Resolve circular dependencies between Modules
    S3Module,
  ],
  providers: [
    UsersService,
    UserPropertiesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService, UserPropertiesService],
})
export class UsersModule {}
