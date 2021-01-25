import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyGet } from '@truepoint/shared/dist/dto/featureSuggestion/replyGet.dto';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { ReplyPatch } from '@truepoint/shared/dist/dto/featureSuggestion/replyPatch.dto';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';
import { UserEntity } from '../users/entities/user.entity';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';

@Injectable()
export class FeatureSuggestionReplyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(FeatureSuggestionEntity)
    private readonly featureSuggestionRepository: Repository<FeatureSuggestionEntity>,
    @InjectRepository(FeatureSuggestionReplyEntity)
    private readonly featureSuggestionReplyRepository: Repository<FeatureSuggestionReplyEntity>,
  ) {}

  // **************************************************
  // 기능제안 답변
  // get - 모든 feature suggestion reply 조회 (단일 조회가 의미가 없다.)
  async findAll(req: ReplyGet): Promise<FeatureSuggestionReplyEntity[]> {
    return this.featureSuggestionReplyRepository
      .find({
        where: { suggestionId: req.id },
        order: { createdAt: 'ASC' },
        relations: ['author'],
      });
  }

  // post - feature suggestion reply 생성 # 관리자이므로 userId가 존재하지 않는다.
  async insertOne(data: ReplyPost): Promise<FeatureSuggestionReplyEntity> {
    const author = await this.usersRepository.findOne(data.author);
    // 답변을 달고자 하는 기능제안 글
    const currentSuggestion = await this.featureSuggestionRepository.findOne(data.suggestionId);

    // 해당 기능 제안 글의 상태가 미확인 인 경우 검토중으로 변경 (1=검토중)
    if (currentSuggestion.state === 0) {
      this.featureSuggestionRepository.save({
        ...currentSuggestion, state: 1,
      });
    }

    const result = await this
      .featureSuggestionReplyRepository
      .save({ ...data, author });
    return result;
  }

  // patch - feature suggestion reply 수정
  async updateOne(data: ReplyPatch): Promise<number> {
    const { author, content, id } = data;
    // 작성자 찾기
    const authorEntity = await this.usersRepository.findOne(author);
    const result = await this
      .featureSuggestionReplyRepository
      .update({ replyId: id }, { author: authorEntity, content });
    return result.affected;
  }

  //  delete - feature suggestion의 삭제
  async deleteOne(req: Pick<ReplyPatch, 'id'>): Promise<number> {
    const result = await this
      .featureSuggestionReplyRepository
      .delete({ replyId: req.id });
    return result.affected;
  }
}
