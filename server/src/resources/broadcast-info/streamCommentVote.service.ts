import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamCommentVoteEntity } from './entities/streamCommentVote.entity';

@Injectable()
export class StreamCommentVoteService {
  constructor(
    @InjectRepository(StreamCommentVoteEntity)
    private readonly streamCommentVoteRepository: Repository<StreamCommentVoteEntity>,
  ) {}

  private async findVote(commentId: number,
    userIp: string, userId: string | undefined): Promise<StreamCommentVoteEntity> {
    if (userId) {
      return this.streamCommentVoteRepository.findOne({
        where: { commentId, userId },
      });
    }
    return this.streamCommentVoteRepository.findOne({
      where: { commentId, userIp },
    });
  }

  private async createHateRecord(commentId: number,
    userIp: string, userId: string|undefined): Promise<StreamCommentVoteEntity> {
    return this.streamCommentVoteRepository.save({
      commentId, userIp, userId, vote: false,
    });
  }

  private async createLikeRecord(commentId: number,
    userIp: string, userId: string|undefined): Promise<StreamCommentVoteEntity> {
    return this.streamCommentVoteRepository.save({
      commentId, userIp, userId, vote: true,
    });
  }

  private async removeVoteRecord(voteRecord: StreamCommentVoteEntity): Promise<any> {
    return this.streamCommentVoteRepository.remove(voteRecord);
  }

  private async toggleVoteRecord(voteRecord: StreamCommentVoteEntity): Promise<StreamCommentVoteEntity> {
    return this.streamCommentVoteRepository.save({
      ...voteRecord, vote: !voteRecord.vote,
    });
  }

  async vote(commentId: number,
    userIp: string,
    userId: string|undefined,
    vote: 1|0): Promise<{like: number, hate: number}> {
    const voteRecord = await this.findVote(commentId, userIp, userId);
    const result = {
      hate: 0,
      like: 0,
    };
    try {
      if (vote === 0) { // 싫어요 요청을 한 경우  
        if (!voteRecord) { // 좋아요 싫어요 아무것도 누르지 않은 경우
          // 싫어요 레코드 생성
          await this.createHateRecord(commentId, userIp, userId);
          result.hate += 1;
        } else if (voteRecord.vote === false) { // 이미 싫어요를 눌렀다면 
          // 싫어요 레코드 삭제
          await this.removeVoteRecord(voteRecord);
          result.hate -= 1;
        } else if (voteRecord.vote === true) { // 이미 좋아요를 눌렀다면
          // 좋아요 레코드를 싫어요로 수정
          await this.toggleVoteRecord(voteRecord);
          result.hate += 1;
          result.like -= 1;
        }
      } else if (vote === 1) { // 좋아요 요청을 한 경우
        if (!voteRecord) { // 좋아요 싫어요 아무것도 누르지 않은 경우
          // 좋아요 레코드 생성
          await this.createLikeRecord(commentId, userIp, userId);
          result.like += 1;
        } else if (voteRecord.vote === true) { // 이미 좋아요를 눌렀다면 
          // 좋아요 레코드 삭제
          await this.removeVoteRecord(voteRecord);
          result.like -= 1;
        } else if (voteRecord.vote === false) { // 이미 싫어요 눌렀다면
          // 싫어요 레코드를 좋아요로 수정
          await this.toggleVoteRecord(voteRecord);
          result.hate -= 1;
          result.like += 1;
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
