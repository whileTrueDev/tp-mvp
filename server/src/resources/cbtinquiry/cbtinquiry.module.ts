import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from '../slack/slack.module';
import { CbtInquiryEntity } from './entities/cbtinquiry.entity';
import { CbtInquiryController } from './cbtinquiry.controller';
import { CbtInquiryService } from './cbtinquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CbtInquiryEntity]),
    SlackModule,
  ],
  controllers: [CbtInquiryController],
  providers: [CbtInquiryService],
})
export class CbtInquiryModule {}
