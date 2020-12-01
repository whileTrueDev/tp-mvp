import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyGet } from '@truepoint/shared/dist/dto/featureSuggestion/replyGet.dto';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { ReplyPatch } from '@truepoint/shared/dist/dto/featureSuggestion/replyPatch.dto';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class FeatureSuggestionReplyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
