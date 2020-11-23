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

@Module({
  imports: [TypeOrmModule.forFeature([
    PlatformAfreecaEntity,
    PlatformTwitchEntity,
    PlatformYoutubeEntity,
    UserEntity,
    UserTokenEntity,
    SubscribeEntity,
  ]),
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
