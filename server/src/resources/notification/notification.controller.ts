import {
  Controller, Get, Req, Body, Patch
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './interface/notification.interface';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAllUserNotifications(): Notification[] {
    return this.notificationService.findAll();
  }

  @Patch()
  updateNotificationReadState(@Body('index') index: number): boolean {
    return this.notificationService.changeReadState(index);
  }
}
