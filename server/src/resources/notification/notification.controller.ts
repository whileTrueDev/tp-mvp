import {
  // UseGuards, 
  Controller, Get, Body, Patch, Query,
  Post, UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

// shared DTOs
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/notification/notificationPost.dto';

// Gaurd
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// service
import { NotificationService } from './notification.service';
// entity
import { NotificationEntity } from './entities/notification.entity';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 특정 유저 알림 읽음 표시
   * @param changeReadState 유저아이디와 인덱스
   */
  @Patch()
  // @UseGuards(JwtAuthGuard)
  updateNotificationReadState(
    @Body(new ValidationPipe()) changeReadState: ChangeReadState,
  ): Promise<boolean> {
    return this.notificationService.changeWithUserId(changeReadState);
  }

  /**
  * 특정 유저에 대한 알림 내역 조회 or 모든 알림 조회
  * @param req 유저아이디 존재시 해당 유저에 대한 알림 조회
  */
  @Get()
  getNotification(
      @Query(new ValidationPipe()) req: NotificationGetRequest,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.findAll(req);
  }

  /**
  * 알림 생성 , json.stringfy()
  * @param data userIds 는 반드시 하나라도 유저 아이디가 존재하여야 한다. ['userId1','userId2' ... ]
  */
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotification(
    @Body(new ValidationPipe()) data: NotificationPostRequest,
  ): Promise<boolean> {
    return this.notificationService.send(data);
  }
}
