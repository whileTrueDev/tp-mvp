import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseInterceptors, ValidationPipe,
} from '@nestjs/common';
import { NoticeDto } from '@truepoint/shared/dist/dto/notice/notice.dto';
import { NoticePatchRequest } from '@truepoint/shared/dist/dto/notice/noticePatchRequest.dto';
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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NoticeEntity> {
    return this.noticeService.findOne(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotice(
    @Body(ValidationPipe) data: NoticeDto,
  ): Promise<NoticeEntity> {
    return this.noticeService.createNotice(data);
  }

  @Patch()
  async updateNotice(
    @Body(ValidationPipe) data: NoticePatchRequest,
  ): Promise<number> {
    // Return affected rows. 1을 반환받았다면 1개의 공지사항이 변경된 것.
    return this.noticeService.updateNotice(data);
  }

  @Delete()
  async deleteNotice(
    @Body('id', ParseIntPipe) id: number,
  ): Promise<number> {
    return this.noticeService.deleteNotice(id);
  }
}
