import {
  Injectable, InternalServerErrorException, BadRequestException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ChangeReadState } from './dto/changeReadState.dto';
import { FindAllNotifications } from './dto/findAllNotifications.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
      private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findAll(findAllRequest: FindAllNotifications): Promise<NotificationEntity[]> {
    // 로그인한 유저 아이디와 일치하는 모든 알림을 검색 (빈 리스트 포함)
    const notificationList = await this.notificationRepository
      .createQueryBuilder()
      .where('userId = :id', { id: findAllRequest.userId })
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notification ... ');
      });

    return notificationList;
  }

  async changeReadState(changeReadState: ChangeReadState): Promise<boolean> {
    // 로그인한 유저 아이디와 일치하는 모든 알림 중 인자로 받은 알림 인덱스와
    // 일치하는 알림의 readState 0 -> 1 수정  

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
}
