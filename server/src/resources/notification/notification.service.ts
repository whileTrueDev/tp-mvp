import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/notification/notificationPost.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
      private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
  * 특정 알림의 readState 를 수정
  * @param changeReadState 알림의 고유 인덱스와 유저 아이디
  */
  async changeWithUserId(changeReadState: ChangeReadState): Promise<boolean> {
    const updateResult = await this.notificationRepository
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ readState: 1 })
      .where('userId= :id', { id: changeReadState.userId })
      .andWhere('index= :notiIndex', { notiIndex: changeReadState.index })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notification ... ');
      });

    if (updateResult.affected < 1) {
      throw new HttpException('Request Notification Index is Invalid ... ', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  /**
  * 특정 유저 알림 내역 조회 or 모든 유저 알림 내역 조회
  * @param req userId의 포함 여부에 따라 조회 범위 조정
  */
  async findAll(req: NotificationGetRequest): Promise<NotificationEntity[]> {
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

  /**
  * 알림 전송
  * @param req userIds: string[] 에 존재하는 userIds 의 유저에게 알림 생성 (전송)
  * 
  */
  async send(req: NotificationPostRequest): Promise<boolean> {
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
