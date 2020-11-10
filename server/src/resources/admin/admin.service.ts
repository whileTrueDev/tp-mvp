import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTOs
// notification (개인알림)
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationPost.dto';
// Entities
// notification (개인알림)
import { NotificationEntity } from '../notification/entities/notification.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // get - 특정 유저에 대한 알림 내역 조회
  async getNotification(req: NotificationGetRequest): Promise<NotificationEntity[]> {
    // 단일 공지사항 조회
    if (Object.hasOwnProperty.call(req, 'userId')) {
      return this.notificationRepository
        .find({
          where: { userId: req.userId },
          order: {
            createdAt: 'DESC',
          },
        })
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
        });
    }

    return this.notificationRepository
      .find()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // post - 알림 전송 및 다인 전송
  async postNotification(req: NotificationPostRequest): Promise<boolean> {
    const { title, content, userId } = req;

    const insertData: any[] = userId.map(((user) => ({
      userId: user,
      title,
      content,
    })));
    const result = await this.notificationRepository
      .save(insertData)
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
    return !!result;
  }
}
