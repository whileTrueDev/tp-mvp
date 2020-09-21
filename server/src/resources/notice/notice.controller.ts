import { Controller, Get, Query } from '@nestjs/common';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeService } from './notice.service';
import { FindOneNoticeDto } from './dto/findOneNotice.dto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async findAll(): Promise<NoticeEntity[]> {
    return this.noticeService.findAll();
  }

  @Get()
  async findOne(
    @Query(new ValidationPipe()) findOneNoticeDto: FindOneNoticeDto
  ): Promise<NoticeEntity> {
    return this.noticeService.findOne(findOneNoticeDto);
  }
}
