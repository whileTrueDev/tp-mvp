import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTOs
// notification (개인알림)
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationGet.dto';
import { NotificationPostRequest } from '@truepoint/shared/dist/dto/admin/notification/notificationPost.dto';
// feature suggestion (기능제안)
import { FeatureSuggestionPatchRequest } from '@truepoint/shared/dist/dto/admin/feature/featureSuggestionPatch.dto';
// feature suggestion reply (기능제안에 대한 답변)
import { ReplyPostRequest } from '@truepoint/shared/dist/dto/admin/reply/replyPost.dto';
import { ReplyGetRequest } from '@truepoint/shared/dist/dto/admin/reply/replyGetRequest.dto';
import { ReplyPatchRequest } from '@truepoint/shared/dist/dto/admin/reply/replyPatchRequest.dto';

// Entities
// notification (개인알림)
import { NotificationEntity } from '../notification/entities/notification.entity';
// feature suggestion (기능제안)
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
// feature suggestion reply (기능제안에 대한 답변)
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(FeatureSuggestionEntity)
    private readonly featureSuggestionRepository: Repository<FeatureSuggestionEntity>,
    @InjectRepository(FeatureSuggestionReplyEntity)
    private readonly featureSuggestionReplyRepository: Repository<FeatureSuggestionReplyEntity>,
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

  // get - 모든 feature suggestion 조회 (단일 조회가 의미가 없다.)
  async getFeatureSuggestion(): Promise<FeatureSuggestionEntity[]> {
    return this.featureSuggestionRepository
      .find({
        order: {
          createdAt: 'DESC',
        },
      })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // patch - feature suggestion의 상태 수정
  async patchFeatureSuggestion(data: FeatureSuggestionPatchRequest): Promise<boolean> {
    const {
      state, id,
    } = data;
    const result = await this.featureSuggestionRepository
      .update({ suggestionId: id }, { state })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });

    return !!result;
  }

  //  delete - feature suggestion의 삭제
  async deleteFeatureSuggestion(req: Pick<FeatureSuggestionPatchRequest, 'id'>): Promise<boolean> {
    const result = await this.featureSuggestionRepository
      .delete({ suggestionId: req.id })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });

    return !!result;
  }

  // get - 모든 feature suggestion reply 조회 (단일 조회가 의미가 없다.)
  async getReply(req: ReplyGetRequest): Promise<FeatureSuggestionReplyEntity[]> {
    return this.featureSuggestionReplyRepository
      .find({
        where: {
          suggestionId: req.id,
        },
        order: {
          createdAt: 'ASC',
        },
      })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
  }

  // post - feature suggestion reply 생성 # 관리자이므로 userId가 존재하지 않는다.
  async loadReply(data: ReplyPostRequest): Promise<boolean> {
    const result = await this.featureSuggestionReplyRepository
      .save({ ...data })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
    return !!result;
  }

  // patch - feature suggestion reply 수정
  async patchReply(data: ReplyPatchRequest): Promise<boolean> {
    const {
      author, content, id,
    } = data;
    const result = await this.featureSuggestionReplyRepository
      .update({ replyId: id }, { author, content })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
    return !!result;
  }

  //  delete - feature suggestion의 삭제
  async deleteReply(req: Pick<ReplyPatchRequest, 'id'>): Promise<any> {
    const result = await this.featureSuggestionReplyRepository
      .delete({ replyId: req.id })
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Notice ... ');
      });
    return !!result;
  }
}
