import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { RankingsEntity } from './entities/rankings.entity';
import { CreatorRatingsModule } from '../creatorRatings/creatorRatings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RankingsEntity,
    ]),
    CreatorRatingsModule,
  ],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
