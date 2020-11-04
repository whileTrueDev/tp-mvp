import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';
import { FindAllNotifications } from '@truepoint/shared/dist/dto/notification/findAllNotifications.dto';
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/notification/notificationPost.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
      private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /* 
    로그인한 유저 아이디에 대한 모든 알림 검색 (빈 리스트 포함)

    input   : userId
    output  : NotificationEntity[]
  */
  async findAllWithUserId(findAllRequest: FindAllNotifications): Promise<NotificationEntity[]> {
    const notificationList = await this.notificationRepository
      .createQueryBuilder()
      .where('userId = :id', { id: findAllRequest.userId })
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notification ... ');
      });

    return notificationList;
  }

  /* 
    특정 알림의 readState 를 0 -> 1 수정

    input   : { userId, index }
    output  : boolean
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

  /* 
    유저 상관 없이 모든 알림 내역 조회

    input   : empty
    output  : NotificationEntity[]
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

  /* 
    개인 알림 전송 및 다인 전송

    input   : {
      userIds : string[];
      title   : string;
      content : string;
    }
    output  : NotificationEntity[]
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
