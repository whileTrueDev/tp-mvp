import {
  Injectable, InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// notice (공지사항)
import { NoticeEntity } from './entities/notice.entity';
import { Notice } from './dto/notice/notice.dto';
import { NoticeGetRequest } from './dto/notice/noticeGetRequest.dto';
import { NoticePatch } from './dto/notice/noticePatchRequest.dto';
import { NoticeDelete } from './dto/notice/noticeDeleteRequest.dto';

// notification (개인알림)
import { NotificationEntity } from './entities/notification.entity';
import { NotificationGetRequest } from './dto/notification/notificationGet.dto';
import { NotificationPostRequest } from './dto/notification/notificationPost.dto';

// feature suggestion (기능제안)
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
import { FeatureSuggestionPatchRequest } from './dto/feature/featureSuggestionPatch.dto';
import { FeatureSuggestionDeleteRequest } from './dto/feature/featureSuggestionDelete.dto';

// feature suggestion reply (기능제안에 대한 답변)
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';
import { ReplyPostRequest } from './dto/reply/replyPost.dto';
import { ReplyGetRequest } from './dto/reply/replyGetRequest.dto';
import { ReplyPatchRequest } from './dto/reply/replyPatchRequest.dto';
import { ReplyDeleteRequest } from './dto/reply/replyDeleteRequest.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(FeatureSuggestionEntity)
    private readonly featureSuggestionRepository: Repository<FeatureSuggestionEntity>,
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

  // get - 모든 feature suggestion 조회 (단일 조회가 의미가 없다.)
  async getFeatureSuggestion() : Promise<FeatureSuggestionEntity[]> {
    const query = `
    SELECT *
    FROM FeatureSuggestionTest
    ORDER BY createdAt DESC
      `;
    return this.featureSuggestionRepository
      .query(query, [])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // patch - feature suggestion의 상태 수정
  async patchFeatureSuggestion(data: FeatureSuggestionPatchRequest): Promise<any> {
    const {
      state, id
    } = data;
    const query = `
    UPDATE FeatureSuggestionTest
    SET  state = ?
    WHERE suggestionId = ?
    `;

    return this.noticeRepository.query(query, [state, id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  //  delete - feature suggestion의 삭제
  async deleteFeatureSuggestion(req :FeatureSuggestionDeleteRequest) : Promise<any> {
    const query = `
    DELETE FROM FeatureSuggestionTest
    WHERE id = ?
    `;

    return this.noticeRepository
      .query(query, [req.id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // get - 모든 feature suggestion reply 조회 (단일 조회가 의미가 없다.)
  async getReply(req: ReplyGetRequest) : Promise<FeatureSuggestionReplyEntity[]> {
    const { id } = req;
    const query = `
      SELECT *
      FROM FeatureSuggestionReplyTest
      WHERE suggestionId = ?
      ORDER BY createdAt DESC
        `;
    return this.featureSuggestionRepository
      .query(query, [id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // post - feature suggestion reply 생성
  async loadReply(data: ReplyPostRequest): Promise<any> {
    const {
      suggestionId, content, author
    } = data;
    const query = `
      INSERT INTO FeatureSuggestionReplyTest
      (suggestionId, content, author) 
      VALUES (?, ?, ?)
      `;

    return this.noticeRepository.query(query, [suggestionId, content, author])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // patch - feature suggestion reply 수정
  async patchReply(data: ReplyPatchRequest): Promise<any> {
    const {
      author, content, id
    } = data;
    const query = `
    UPDATE FeatureSuggestionReplyTest
    SET  author = ?,  content = ?
    WHERE replyId = ?
    `;

    return this.noticeRepository.query(query, [author, content, id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  //  delete - feature suggestion의 삭제
  async deleteReply(req :ReplyDeleteRequest) : Promise<any> {
    const query = `
    DELETE FROM FeatureSuggestionReplyTest
    WHERE replyId = ?
    `;

    return this.noticeRepository
      .query(query, [req.id])
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }
}
