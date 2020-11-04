import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInquiryDto } from '@truepoint/shared/dist/dto/inquiry/createInquiry.dto';
import { InquiryEntity } from './entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepository: Repository<InquiryEntity>,
  ) {}

  /**
   * 문의 생성 service method.
   * @param createInquiryDto 문의 생성 DTO
   */
  public async create(createInquiryDto: CreateInquiryDto): Promise<InquiryEntity> {
    return this.inquiryRepository.save(createInquiryDto);
  }
}
