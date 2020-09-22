import {
  Controller, Get, Param, Query
} from '@nestjs/common';
import { ReadNoticeOutlineDto } from './dto/readNoticeOutline.dto';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async findAll(
    @Query('limit') limit: number,
  ): Promise<NoticeEntity[]> {
    return this.noticeService.findAll(limit);
  }

  @Get('outline')
  async findForDashboard(
    @Query() readNoticeOutlineDto: ReadNoticeOutlineDto,
  ): Promise<NoticeEntity[]> {
    return this.noticeService.findOutline(readNoticeOutlineDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<NoticeEntity> {
    return this.noticeService.findOne(id);
  }
}
