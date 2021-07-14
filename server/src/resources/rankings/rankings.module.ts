import { Module, forwardRef } from '@nestjs/common';
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
    forwardRef(() => CreatorRatingsModule),
  ],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}
