import {
  Controller,
} from '@nestjs/common';

// notification dto
// service
// import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  // constructor(private readonly adminService: AdminService) {}

  // ********************************* notification *****************************
  // @Get('notification')
  // getNotification(
  //     @Query(new ValidationPipe()) req: NotificationGetRequest,
  // ): Promise<NotificationEntity[]> {
  //   return this.adminService.getNotification(req);
  // }

  // // json.stringfy() => 하나라도 반드시 [] 내부에 존재하도록 한다.
  // // 포맷이 반드시 ['userId1', 'userId2']
  // @Post('notification')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async createNotification(
  //   @Body(new ValidationPipe()) data: NotificationPostRequest,
  // ): Promise<boolean> {
  //   return this.adminService.postNotification(data);
  // }
  // ********************************* notification end *****************************
}
