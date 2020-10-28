import {
  Controller, Get, Body, Patch, Query, UseGuards,
} from '@nestjs/common';
// DTOs
import { FindAllNotifications } from '@truepoint/shared/dist/dto/notification/findAllNotifications.dto';
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
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
    return this.notificationService.findAll(findRequest);
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
    return this.notificationService.changeReadState(changeReadState);
  }
}
