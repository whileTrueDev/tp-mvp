import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorCommentVoteEntity } from './entities/creatorCommentVote.entity';

@Injectable()
export class CreatorCommentVoteService {
  constructor(
    @InjectRepository(CreatorCommentVoteEntity)
    private readonly creatorCommentVoteRepository: Repository<CreatorCommentVoteEntity>,
  ) {}

  private async findVote(commentId: number,
    userIp: string, userId: string | undefined): Promise<CreatorCommentVoteEntity> {
    if (userId) {
      return this.creatorCommentVoteRepository.findOne({
        where: { commentId, userId },
      });
    }
    return this.creatorCommentVoteRepository.findOne({
      where: { commentId, userIp },
    });
  }

  private async createHateRecord(commentId: number,
    userIp: string, userId: string|undefined): Promise<CreatorCommentVoteEntity> {
    return this.creatorCommentVoteRepository.save({
      commentId, userIp, userId, vote: false,
    });
  }

  private async createLikeRecord(commentId: number,
    userIp: string, userId: string|undefined): Promise<CreatorCommentVoteEntity> {
    return this.creatorCommentVoteRepository.save({
      commentId, userIp, userId, vote: true,
    });
  }

  private async removeVoteRecord(voteRecord: CreatorCommentVoteEntity): Promise<any> {
    return this.creatorCommentVoteRepository.remove(voteRecord);
  }

  private async toggleVoteRecord(voteRecord: CreatorCommentVoteEntity): Promise<CreatorCommentVoteEntity> {
    return this.creatorCommentVoteRepository.save({
      ...voteRecord, vote: !voteRecord.vote,
    });
  }

  async vote(commentId: number,
    userIp: string,
    userId: string|undefined,
    vote: 1|0): Promise<{like: number, hate: number}> {
    const voteRecord = await this.findVote(commentId, userIp, userId);
    try {
      if (vote === 0) { // 싫어요 요청을 한 경우  
        if (!voteRecord) { // 좋아요 싫어요 아무것도 누르지 않은 경우
          // 싫어요 레코드 생성
          await this.createHateRecord(commentId, userIp, userId);
        } else if (voteRecord.vote === false) { // 이미 싫어요를 눌렀다면 
          // 싫어요 레코드 삭제
          await this.removeVoteRecord(voteRecord);
        } else if (voteRecord.vote === true) { // 이미 좋아요를 눌렀다면
          // 좋아요 레코드를 싫어요로 수정
          await this.toggleVoteRecord(voteRecord);
        }
      } else if (vote === 1) { // 좋아요 요청을 한 경우
        if (!voteRecord) { // 좋아요 싫어요 아무것도 누르지 않은 경우
          // 좋아요 레코드 생성
          await this.createLikeRecord(commentId, userIp, userId);
        } else if (voteRecord.vote === true) { // 이미 좋아요를 눌렀다면 
          // 좋아요 레코드 삭제
          await this.removeVoteRecord(voteRecord);
        } else if (voteRecord.vote === false) { // 이미 싫어요 눌렀다면
          // 싫어요 레코드를 좋아요로 수정
          await this.toggleVoteRecord(voteRecord);
        }
      }

      const result = {
        like: await this.creatorCommentVoteRepository.count({
          where: {
            commentId, vote: 1,
          },
        }),
        hate: await this.creatorCommentVoteRepository.count({
          where: { commentId, vote: 0 },
        }),
      };
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
