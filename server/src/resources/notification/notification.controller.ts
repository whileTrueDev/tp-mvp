import {
  Controller, Get, Req, Body, Patch, Post, Param, Query
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { ChangeReadState } from './dto/changeReadState.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAllUserNotifications(@Query('userId') userId: string): Promise<NotificationEntity[]> {
    return this.notificationService.findAll(userId);
  }

  @Patch()
  updateNotificationReadState(@Body(
    new ValidationPipe()
  ) changeReadState: ChangeReadState)
    : Promise<boolean> {
    return this.notificationService.changeReadState(changeReadState);
  }
}
