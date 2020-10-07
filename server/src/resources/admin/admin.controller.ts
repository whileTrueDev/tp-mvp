import {
  Controller, Get, Body, Patch, Query, Delete,
  Post, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { NoticeEntity } from './entities/notice.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationGetRequest } from './dto/notificationGet.dto';
import { NotificationPostRequest } from './dto/notificationPost.dto';

import { NoticeGetRequest } from './dto/noticeGetRequest.dto';
import { NoticePatch } from './dto/noticePatchRequest.dto';
import { NoticeDelete } from './dto/noticeDeleteRequest.dto';

import { Notice } from './dto/notice.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('notice')
  getNotice(
      @Query(new ValidationPipe()) req: NoticeGetRequest
  ): Promise<NoticeEntity[]> {
    return this.adminService.getNotice(req);
  }

  @Post('notice')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotice(
    @Body(new ValidationPipe()) data: Notice
  ): Promise<NoticeEntity> {
    console.log(data);
    return this.adminService.loadNotice(data);
  }

  @Patch('notice')
  async updateNotice(
    @Body(new ValidationPipe()) data: NoticePatch
  ): Promise<boolean> {
    return this.adminService.patchNotice(data);
  }

  @Delete('notice')
  async deleteNotice(
    @Body() data: NoticeDelete
  ): Promise<boolean> {
    console.log(data);
    return this.adminService.deleteNotice(data);
  }

  @Get('notification')
  getNotification(
      @Query(new ValidationPipe()) req: NotificationGetRequest
  ): Promise<NotificationEntity[]> {
    return this.adminService.getNotification(req);
  }

  // json.stringfy() => 하나라도 반드시 [] 내부에 존재하도록 한다.
  // 포맷이 반드시 ['userId1', 'userId2']
  @Post('notification')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotification(
    @Body(new ValidationPipe()) data: NotificationPostRequest
  ): Promise<any> {
    return this.adminService.postNotification(data);
  }
}
