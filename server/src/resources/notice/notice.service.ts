import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneNoticeDto } from './dto/findOneNotice.dto';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

  ) {}

  async findAll(): Promise<NoticeEntity[]> {
    return this.noticeRepository.find();
  }

  async findOne(dto: FindOneNoticeDto): Promise<NoticeEntity> {
    return this.noticeRepository.findOne(dto.id);
  }
}
