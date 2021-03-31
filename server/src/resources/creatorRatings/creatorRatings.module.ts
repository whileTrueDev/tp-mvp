import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorRatingsController } from './creatorRatings.controller';
import { CreatorRatingsService } from './creatorRatings.service';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { RankingsEntity } from '../rankings/entities/rankings.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    CreatorRatingsEntity,
    PlatformAfreecaEntity, PlatformTwitchEntity, RankingsEntity,

  ])],
  controllers: [CreatorRatingsController],
  providers: [CreatorRatingsService],
})
export class CreatorRatingsModule {}
