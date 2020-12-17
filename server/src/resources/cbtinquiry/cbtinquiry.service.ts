import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCbtInquiryDto } from '@truepoint/shared/dist/dto/cbtinquiry/createCbtInquiry.dto';
import { CbtInquiryEntity } from './entities/cbtinquiry.entity';

@Injectable()
export class CbtInquiryService {
  constructor(
    @InjectRepository(CbtInquiryEntity)
    private readonly cbtinquiryRepository: Repository<CbtInquiryEntity>,
  ) {}

  /**
   * 문의 생성 service method.
   * @param createCbtInquiryDto 문의 생성 DTO
   */
  public async create(createCbtInquiryDto: CreateCbtInquiryDto): Promise<CbtInquiryEntity> {
    return this.cbtinquiryRepository.save(createCbtInquiryDto);
  }
}
