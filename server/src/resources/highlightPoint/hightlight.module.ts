import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamsEntity } from '../stream-analysis/entities/streams.entity';
// import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamsEntity,
    ]),
  ],
  providers: [HighlightService],
  controllers: [HighlightController],
  exports: [HighlightService],
})
export class HighlightModule { }
