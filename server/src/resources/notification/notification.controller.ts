import {
  Controller, Get, Body, Patch, Query,
  UseGuards, Post, UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

// shared DTOs
import { FindAllNotifications } from '@truepoint/shared/dist/dto/notification/findAllNotifications.dto';
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/notification/notificationPost.dto';

// Gaurd
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// service
import { NotificationService } from './notification.service';
// entity
import { NotificationEntity } from './entities/notification.entity';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /*
    input   :  userId
    output  :  NotificationEntity[]
  */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAllUserNotifications(
    @Query(new ValidationPipe()) findRequest: FindAllNotifications,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.findAllWithUserId(findRequest);
  }

  /*
    input   :  userId, notification Index (primary index)
    output  :  true | false
  */
  @Patch()
  @UseGuards(JwtAuthGuard)
  updateNotificationReadState(
    @Body(new ValidationPipe()) changeReadState: ChangeReadState,
  ): Promise<boolean> {
    return this.notificationService.changeWithUserId(changeReadState);
  }

  /*
    input   :  empty
    output  :  NotificationEntity[]
  */
  @Get('admin')
  getNotification(
      @Query(new ValidationPipe()) req: NotificationGetRequest,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.findAll(req);
  }

  /*
    json.stringfy() => 하나라도 반드시 [] 내부에 존재하도록 한다.
    포맷이 반드시 ['userId1', 'userId2']

    input   : {
      userIds : string[];
      title   : string;
      content : string;
    }
    output  : NotificationEntity[]
  */
  @Post('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotification(
    @Body(new ValidationPipe()) data: NotificationPostRequest,
  ): Promise<boolean> {
    return this.notificationService.send(data);
  }
}
