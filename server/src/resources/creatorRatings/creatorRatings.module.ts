import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorRatingsController } from './creatorRatings.controller';
import { CreatorRatingsService } from './creatorRatings.service';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CreatorRatingsEntity])],
  controllers: [CreatorRatingsController],
  providers: [CreatorRatingsService],
})
export class CreatorRatingsModule {}
