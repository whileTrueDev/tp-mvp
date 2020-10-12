import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from '../slack/slack.module';
import { InquiryEntity } from './entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryEntity]),
    SlackModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
