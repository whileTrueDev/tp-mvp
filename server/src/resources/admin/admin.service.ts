import {
  Injectable, InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { Notice } from './dto/notice.dto';
import { NoticeGetRequest } from './dto/noticeGetRequest.dto';
import { NoticePatch } from './dto/noticePatchRequest.dto';
import { NoticeDelete } from './dto/noticeDeleteRequest.dto';

import { NotificationEntity } from './entities/notification.entity';
import { NotificationGetRequest } from './dto/notificationGet.dto';
import { NotificationPostRequest } from './dto/notificationPost.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // get - 모든 notice 조회 
  async getNotice(req : NoticeGetRequest) : Promise<NoticeEntity[]> {
    // 단일 공지사항 조회
    if (req.hasOwnProperty('id')) {
      const query = `
      SELECT *
      FROM NoticeTest
      WHERE id = ?
      `;

      return this.noticeRepository
        .query(query, [req.id])
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
        });
    }

    const query = `
    SELECT *
    FROM NoticeTest
    ORDER BY createdAt, isImportant DESC
      `;
    return this.noticeRepository
      .query(query, [])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // post - notice 생성
  async loadNotice(data: Notice): Promise<any> {
    const {
      category, author, title, content, isImportant
    } = data;
    const query = `
      INSERT INTO NoticeTest
      (category, author, title, content, isImportant) 
      VALUES (?, ?, ?, ?, ?)
      `;

    return this.noticeRepository.query(query, [category, author, title, content, isImportant])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // patch - notice 수정
  async patchNotice(data: NoticePatch): Promise<any> {
    const {
      category, author, title, content, isImportant, id
    } = data;
    const query = `
    UPDATE NoticeTest
    SET  category = ?, author = ?,  title = ?, content = ?, isImportant = ?
    WHERE id = ?
    `;

    return this.noticeRepository.query(query, [category, author, title, content, isImportant, id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  //  delete - notice 삭제
  async deleteNotice(req : NoticeDelete) : Promise<any> {
    const query = `
    DELETE FROM NoticeTest
    WHERE id = ?
    `;

    return this.noticeRepository
      .query(query, [req.id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // get - 특정 유저에 대한 알림 내역 조회
  async getNotification(req : NotificationGetRequest) : Promise<NotificationEntity[]> {
    // 단일 공지사항 조회
    if (req.hasOwnProperty('userId')) {
      const query = `
      SELECT *
      FROM NotificationTest
      WHERE userId = ?
      `;

      return this.notificationRepository
        .query(query, [req.userId])
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
        });
    }

    const query = `
    SELECT *
    FROM NotificationTest
    ORDER BY createdAt DESC
      `;
    return this.notificationRepository
      .query(query, [])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // post - 알림 전송 및 다인 전송
  async postNotification(req : NotificationPostRequest) : Promise<any> {
    // 단일 유저에 대한 알림 보내기 
    const { title, content } = req;
    const userId = JSON.parse(req.userId);

    if (Array.isArray(userId)) {
      const rawQuery = userId.reduce((str, id) => `${str}('${id}', '${title}', '${content}'),`, '');
      const conditionQuery = `${rawQuery.slice(0, -1)};`;

      const query = `
      INSERT INTO NotificationTest
      (userId, title, content)
      VALUES ${conditionQuery}
      `;

      return this.notificationRepository
        .query(query, [])
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
        });
    }

    // 다중 유저에 대한 알림 보내기

    const query = `
    INSERT INTO NotificationTest
    (userId, title, content)
    VALUES (?, ?, ?)
    `;
    return this.notificationRepository
      .query(query, [userId, title, content])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }
}
