import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ChangeReadState } from './dto/changeReadState.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
      private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findAll(userId: string): Promise<NotificationEntity[]> {
    // 로그인한 유저 아이디와 일치하는 모든 알림을 검색
    const notificationList = await this.notificationRepository
      .createQueryBuilder()
      .where('userId = :id', { id: userId })
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err);
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
        throw new InternalServerErrorException(err);
      });

    if (updateResult.affected > 0) {
      return true;
    }

    return false;
  }
}
