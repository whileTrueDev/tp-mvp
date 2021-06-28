import { Module } from '@nestjs/common';
// import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';

@Module({
  providers: [HighlightService],
  controllers: [HighlightController],
  exports: [HighlightService],
})
export class HighlightModule { }
