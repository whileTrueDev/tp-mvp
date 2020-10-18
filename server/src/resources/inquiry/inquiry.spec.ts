import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlackService } from '../slack/slack.service';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { InquiryEntity } from './entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

describe('Inquiry Unit Test', () => {
  let controller: InquiryController;
  let service: InquiryService;

  class InquiryRepository extends Repository<InquiryEntity> {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiryController],
      providers: [
        SlackService,
        InquiryService,
        {
          provide: getRepositoryToken(InquiryEntity),
          useClass: InquiryRepository,
        },
      ],
      imports: [ConfigModule],
    }).compile();

    controller = module.get<InquiryController>(InquiryController);
    service = module.get<InquiryService>(InquiryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInquiry', () => {
    const result: InquiryEntity = {
      id: 1,
      author: 'tester',
      email: 'test@test.com',
      content: 'content',
      isReply: false,
      privacyAgreement: true,
      createdAt: new Date(),
    };

    const dto: CreateInquiryDto = {
      author: 'tester',
      email: 'test@test.com',
      content: 'content',
      privacyAgreement: true,
    };
    it('문의 생성 시, 생성된 문의 엔터티를 반홥합니다.', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => result);
      expect(await controller.createInquiry(dto)).toBe(result);
    });
  });
});
