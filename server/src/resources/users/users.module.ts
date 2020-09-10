import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { PlatformAfreecaEntity } from './entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from './entities/platformTwitch.entity';
import { PlatformYoutubeEntity } from './entities/platformYoutube.entity';
import { UserTokenEntity } from './entities/userToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    PlatformAfreecaEntity,
    PlatformTwitchEntity,
    PlatformYoutubeEntity,
    UserEntity,
    UserTokenEntity,
  ]),
  forwardRef(() => AuthModule), // Resolve circular dependencies between Moduels
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
