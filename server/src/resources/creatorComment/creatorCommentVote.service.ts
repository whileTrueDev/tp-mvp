import {
  BadRequestException, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CreatorCommentLikesEntity } from './entities/creatorCommentLikes.entity';
// import { CreatorCommentHatesEntity } from './entities/creatorCommentHates.entity';
import { CreatorCommentVoteEntity } from './entities/creatorCommentVote.entity';

@Injectable()
export class CreatorCommentVoteService {
  constructor(
    @InjectRepository(CreatorCommentVoteEntity)
    private readonly creatorCommentVoteRepository: Repository<CreatorCommentVoteEntity>,
  ) {}

  // userIp가 commentId에 좋아요 한 like 테이블 데이터 찾기
  private async findLike(commentId: number, userIp: string, userId: string|undefined): Promise<any> {
    if (userId) {
      return this.creatorCommentVoteRepository.findOne({
        where: { commentId, userId, vote: true },
      });
    }
    return this.creatorCommentVoteRepository.findOne({
      where: { commentId, userIp, vote: true },
    });
  }

  // userIp가 commentId에 싫어요 한 hate 테이블 데이터 찾기
  private async findHate(commentId: number, userIp: string, userId: string|undefined): Promise<any> {
    if (userId) {
      return this.creatorCommentVoteRepository.findOne({
        where: { commentId, userId, vote: false },
      });
    }
    return this.creatorCommentVoteRepository.findOne({
      where: { commentId, userIp, vote: false },
    });
  }

  // likeEntity 삭제
  private async removeLikeEntity(likeEntity: CreatorCommentVoteEntity) {
    return this.creatorCommentVoteRepository.remove(likeEntity);
  }

  // hateEntity 삭제
  private async removeHateEntity(hateEntity: CreatorCommentVoteEntity) {
    return this.creatorCommentVoteRepository.remove(hateEntity);
  }

  // 좋아요 생성
  // 기존에 싫어요를 했던 댓글인 경우 싫어요 취소
  async like(commentId: number, userIp: string, userId: string|undefined): Promise<CreatorCommentVoteEntity> {
    try {
      const exLike = await this.findLike(commentId, userIp, userId);
      if (exLike) {
        throw new BadRequestException(`ip ${userIp} already liked comment ${commentId}`);
      }

      const exHate = await this.findHate(commentId, userIp, userId);
      if (exHate) {
        return this.creatorCommentVoteRepository.save({ ...exHate, vote: true });
      }

      return this.creatorCommentVoteRepository.save({
        commentId, userIp, userId, vote: true,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 400) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }

  // 좋아요 삭제
  async removeLike(commentId: number, userIp: string, userId: string|undefined): Promise<boolean> {
    try {
      const exLike = await this.findLike(commentId, userIp, userId);
      if (!exLike) {
        throw new BadRequestException(`userIp ${userIp} did not like on commentId ${commentId}`);
      }
      await this.removeLikeEntity(exLike);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in remove like on commentId : ${commentId}`);
    }
  }

  // 싫어요 생성
  // 기존에 좋아요 했던 댓글이면 좋아요 취소
  async hate(commentId: number, userIp: string, userId: string|undefined): Promise<CreatorCommentVoteEntity> {
    try {
      const exHate = await this.findHate(commentId, userIp, userId);
      if (exHate) {
        throw new BadRequestException(`ip ${userIp} already hated comment ${commentId}`);
      }

      const exLike = await this.findLike(commentId, userIp, userId);
      if (exLike) {
        return this.creatorCommentVoteRepository.save({ ...exLike, vote: false });
      }
      return this.creatorCommentVoteRepository.save({
        commentId, userIp, userId, vote: false,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 400) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error, `error in create hate on commentId : ${commentId}`);
    }
  }

  // 싫어요 삭제
  async removeHate(commentId: number, userIp: string, userId: string|undefined): Promise<any> {
    try {
      const exHate = await this.findHate(commentId, userIp, userId);
      if (!exHate) {
        throw new BadRequestException(`userIp ${userIp} did not hate on commentId ${commentId}`);
      }
      await this.removeHateEntity(exHate);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }

  // userIp가 좋아요 한 코멘트 id 목록 반환
  async findLikesByUserIp(userIp: string): Promise<number[]> {
    try {
      const data = await this.creatorCommentVoteRepository.find({
        where: { userIp },
        select: ['commentId'],
      });
      return data.map((d) => d.commentId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in find likes by userIp ${userIp}`);
    }
  }

  // userIp가 싫어요 한 코멘트 id 목록 반환
  async findHatesByUserIp(userIp: string): Promise<number[]> {
    try {
      const data = await this.creatorCommentVoteRepository.find({
        where: { userIp },
        select: ['commentId'],
      });
      return data.map((d) => d.commentId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in find hates by userIp ${userIp}`);
    }
  }
}
