import {
  Controller, Get, Req, Body, Patch, Post, Param, Query, ValidationPipe as SingleValidationPipe
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { ChangeReadState } from './dto/changeReadState.dto';
import { FindAllNotifications } from './dto/findAllNotifications.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  /*
    input   :  userId
    output  :  NotificationEntity[]
  */
  @Get()
  findAllUserNotifications(
    @Query(new ValidationPipe()) findRequest: FindAllNotifications
  ): Promise<NotificationEntity[]> {
    return this.notificationService.findAll(findRequest);
  }

  /*
    input   :  userId, notification Index (primary index)
    output  :  true | false
  */
  @Patch()
  updateNotificationReadState(
    @Body(new ValidationPipe()) changeReadState: ChangeReadState
  ): Promise<boolean> {
    return this.notificationService.changeReadState(changeReadState);
  }
}
