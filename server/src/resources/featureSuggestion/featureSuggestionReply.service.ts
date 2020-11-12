import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyGet } from '@truepoint/shared/dist/dto/featureSuggestion/replyGet.dto';
import { ReplyPost } from '@truepoint/shared/dist/dto/featureSuggestion/replyPost.dto';
import { ReplyPatch } from '@truepoint/shared/dist/dto/featureSuggestion/replyPatch.dto';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';

@Injectable()
export class FeatureSuggestionReplyService {
  constructor(
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
      });
  }

  // post - feature suggestion reply 생성 # 관리자이므로 userId가 존재하지 않는다.
  async insertOne(data: ReplyPost): Promise<FeatureSuggestionReplyEntity> {
    const result = await this
      .featureSuggestionReplyRepository
      .save({ ...data });
    return result;
  }

  // patch - feature suggestion reply 수정
  async updateOne(data: ReplyPatch): Promise<number> {
    const {
      author, content, id,
    } = data;
    const result = await this
      .featureSuggestionReplyRepository
      .update({ replyId: id }, { author, content });
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
