import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { RankingsEntity } from './entities/rankings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    RankingsEntity,
  ])],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
