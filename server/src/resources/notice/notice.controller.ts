import {
  Controller, Get, Param, ParseIntPipe, Query
} from '@nestjs/common';
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
    @Query('important', ParseIntPipe) important: number,
  ): Promise<NoticeEntity[]> {
    return this.noticeService.findOutline(important);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<NoticeEntity> {
    return this.noticeService.findOne(id);
  }
}
