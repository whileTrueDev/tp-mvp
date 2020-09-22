import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadNoticeOutlineDto } from './dto/readNoticeOutline.dto';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

  ) {}

  public async findAll(limit?: number): Promise<NoticeEntity[]> {
    return this.noticeRepository
      .createQueryBuilder()
      .orderBy('isImportant', 'DESC')
      .addOrderBy('createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  public async findOutline({
    important = 2, newOne = 3
  }: ReadNoticeOutlineDto): Promise<NoticeEntity[]> {
    // select * from Notice where isImportant = 1 order by createdAt DESC LIMIT 2
    // select * from Notice where isImportant = 0 order by createdAt DESC LIMIT 3
    const importantNotice = await this.noticeRepository
      .createQueryBuilder()
      .where('isImportant = 1')
      .orderBy('createdAt', 'DESC')
      .limit(important)
      .getMany();

    const newNotice = await this.noticeRepository
      .createQueryBuilder()
      .where('isImportant = 0')
      .orderBy('createdAt', 'DESC')
      .limit(newOne)
      .getMany();

    return importantNotice.concat(newNotice);
  }

  public async findOne(id: string): Promise<NoticeEntity> {
    return this.noticeRepository.findOne(id);
  }
}
