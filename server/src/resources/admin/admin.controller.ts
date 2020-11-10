import {
  Controller, Get, Body, Query,
  Post, UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';

// notification dto
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationPost.dto';
import { NotificationEntity } from '../notification/entities/notification.entity';
// service
import { AdminService } from './admin.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ********************************* notification *****************************
  @Get('notification')
  getNotification(
      @Query(new ValidationPipe()) req: NotificationGetRequest,
  ): Promise<NotificationEntity[]> {
    return this.adminService.getNotification(req);
  }

  // json.stringfy() => 하나라도 반드시 [] 내부에 존재하도록 한다.
  // 포맷이 반드시 ['userId1', 'userId2']
  @Post('notification')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotification(
    @Body(new ValidationPipe()) data: NotificationPostRequest,
  ): Promise<boolean> {
    return this.adminService.postNotification(data);
  }
  // ********************************* notification end *****************************
}
