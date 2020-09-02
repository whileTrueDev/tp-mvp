import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Notification } from './interface/notification.interface';

@Injectable()
export class NotificationService {
  private readonly notifications: NotificationEntity[];
  test: Notification[];
  constructor(
    @InjectRepository(NotificationEntity)
      private readonly notificationRepository: Repository<NotificationEntity>,

  ) {
    this.test = [
      {
        index: 0,
        userid: 'test',
        title: 'Noti_1',
        content: 'this is Noti_1',
        dateform: '2020-09-02',
        readState: 0,
      },
      {
        index: 1,
        userid: 'test',
        title: 'Noti_2',
        content: 'this is Noti_2',
        dateform: '2020-09-02',
        readState: 0,
      },
      {
        index: 2,
        userid: 'test',
        title: 'Noti_3',
        content: 'this is Noti_3',
        dateform: '2020-09-02',
        readState: 0,
      },
      {
        index: 11,
        userid: 'test',
        title: 'Noti_4',
        content: 'this is Noti_4',
        dateform: '2020-09-02',
        readState: 0,
      },
      {
        index: 15,
        userid: 'test',
        title: 'Noti_5',
        content: 'this is Noti_5',
        dateform: '2020-09-02',
        readState: 0,
      },
    ];
  }

  findAll() {
    // 로그인한 유저 아이디와 일치하는 모든 알림을 검색
    return this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userid = :id', { id: 'noti_test' });
      .getAll();
    // return this.test;
  }

  changeReadState(index: number): boolean {
    // 로그인한 유저 아이디와 일치하는 모든 알림 중 인자로 받은 알림 인덱스와
    // 일치하는 알림의 readState 0 -> 1 수정

    this.test.forEach((item) => {
      if (item.index === index) {
        this.test[this.test.indexOf(item)].readState = 1;
      }
    });

    return true;
  }
}
