import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorRatingsController } from './creatorRatings.controller';
import { CreatorRatingsService } from './creatorRatings.service';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { DailyAverageRatingsEntity } from './entities/dailyAverageRatings.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { RankingsEntity } from '../rankings/entities/rankings.entity';
import { RankingsModule } from '../rankings/rankings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorRatingsEntity,
      DailyAverageRatingsEntity,
      PlatformAfreecaEntity, PlatformTwitchEntity, RankingsEntity,
    ]),
    forwardRef(() => RankingsModule),
  ],
  controllers: [CreatorRatingsController],
  providers: [CreatorRatingsService],
  exports: [CreatorRatingsService],
})
export class CreatorRatingsModule {}
