import {
  Controller, Get, Body, Patch, Query, Delete,
  Post, UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';

// notification dto
// import { NotificationGetRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationGet.dto';
// import { NotificationPostRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationPost.dto';

// notice dto
import { Notice } from '@truepoint/shared/dist/dto/admin/notice/notice.dto';
import { NoticeGetRequest } from '@truepoint/shared/dist/dto/admin/notice/noticeGetRequest.dto';
import { NoticePatchRequest } from '@truepoint/shared/dist/dto/admin/notice/noticePatchRequest.dto';

// feature suggestion dto
import { FeatureSuggestionPatchRequest } from '@truepoint/shared/dist/dto/admin/feature/featureSuggestionPatch.dto';

// feature suggestion reply dto
import { ReplyGetRequest } from '@truepoint/shared/dist/dto/admin/reply/replyGetRequest.dto';
import { ReplyPostRequest } from '@truepoint/shared/dist/dto/admin/reply/replyPost.dto';
import { ReplyPatchRequest } from '@truepoint/shared/dist/dto/admin/reply/replyPatchRequest.dto';
// entity
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
// import { NotificationEntity } from '../notification/entities/notification.entity';
import { NoticeEntity } from '../notice/entities/notice.entity';
// service
import { AdminService } from './admin.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ********************************* notice *****************************
  @Get('notice')
  getNotice(
      @Query(new ValidationPipe()) req: NoticeGetRequest,
  ): Promise<NoticeEntity[]> {
    return this.adminService.getNotice(req);
  }

  @Post('notice')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotice(
    @Body(new ValidationPipe()) data: Notice,
  ): Promise<NoticeEntity> {
    return this.adminService.loadNotice(data);
  }

  @Patch('notice')
  async updateNotice(
    @Body(new ValidationPipe()) data: NoticePatchRequest,
  ): Promise<boolean> {
    return this.adminService.patchNotice(data);
  }

  @Delete('notice')
  async deleteNotice(
    @Body(new ValidationPipe()) data: Pick<NoticePatchRequest, 'id'>,
  ): Promise<boolean> {
    return this.adminService.deleteNotice(data);
  }
  // ********************************* notice end *****************************

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

  // ********************************* feature suggestion *****************************
  @Get('feature-suggestion')
  getSuggestion(): Promise<FeatureSuggestionEntity[]> {
    return this.adminService.getFeatureSuggestion();
  }

  @Patch('feature-suggestion')
  async updateSuggestion(
    @Body(new ValidationPipe()) data: FeatureSuggestionPatchRequest,
  ): Promise<boolean> {
    return this.adminService.patchFeatureSuggestion(data);
  }

  @Delete('feature-suggestion')
  async deleteSuggestion(
    @Body(new ValidationPipe()) data: Pick<FeatureSuggestionPatchRequest, 'id'>,
  ): Promise<boolean> {
    return this.adminService.deleteFeatureSuggestion(data);
  }
  // ********************************* feature suggestion end *****************************

  // ********************************* feature suggestion reply *****************************
  @Get('suggestion-reply')
  async getReply(
      @Query(new ValidationPipe()) req: ReplyGetRequest,
  ): Promise<FeatureSuggestionReplyEntity[]> {
    return this.adminService.getReply(req);
  }

  @Post('suggestion-reply')
  @UseInterceptors(ClassSerializerInterceptor)
  async createReply(
    @Body(new ValidationPipe()) data: ReplyPostRequest,
  ): Promise<boolean> {
    return this.adminService.loadReply(data);
  }

  @Patch('suggestion-reply')
  async updateReply(
    @Body(new ValidationPipe()) data: ReplyPatchRequest,
  ): Promise<boolean> {
    return this.adminService.patchReply(data);
  }

  @Delete('suggestion-reply')
  async deleteReply(
    @Body(new ValidationPipe()) data: Pick<ReplyPatchRequest, 'id'>,
  ): Promise<boolean> {
    return this.adminService.deleteReply(data);
  }
  // ********************************* feature suggestion reply end *****************************
}
