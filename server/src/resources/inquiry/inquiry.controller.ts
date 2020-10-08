import { Body, Controller, Post } from '@nestjs/common';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { SlackService } from '../slack/slack.service';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { InquiryEntity } from './entities/inquiry.entity';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController {
  constructor(
    private readonly inquiryService: InquiryService,
    private readonly slackService: SlackService
  ) {}

  @Post()
  public async createInquiry(
    @Body(new ValidationPipe()) createInquiryDto: CreateInquiryDto
  ): Promise<InquiryEntity> {
    // 문의 생성
    const createdInquiry = await this.inquiryService.create(createInquiryDto);
    // 슬랙 알림
    this.slackService.message({
      title: '문의 등록 알림',
      text: '문의가 등록되었습니다. 관리자페이지에서 문의를 확인하고, 응답하세요.',
      fields: [
        { title: '성명', value: createdInquiry.author, short: true, },
        { title: '이메일', value: createdInquiry.email, short: true, },
        { title: '문의 내용', value: createdInquiry.content, short: true, },
      ]
    });
    // 생성된 엔터티정보 반환
    return createdInquiry;
  }
}
