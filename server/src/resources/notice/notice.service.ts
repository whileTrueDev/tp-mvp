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
    const noticeList = await this.noticeRepository.find();
    const sorted = noticeList.sort((row1, row2) => {
      if (row2.isImportant) return 1;
      if (row1.isImportant) return -1;
      return new Date(row2.createdAt).getTime()
            - new Date(row1.createdAt).getTime();
    });
    return sorted;
  }

  async findOne(dto: FindOneNoticeDto): Promise<NoticeEntity> {
    return this.noticeRepository.findOne(dto.id);
  }
}
