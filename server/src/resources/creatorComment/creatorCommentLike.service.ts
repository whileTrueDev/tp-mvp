import {
  BadRequestException, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorCommentLikesEntity } from './entities/creatorCommentLikes.entity';
import { CreatorCommentHatesEntity } from './entities/creatorCommentHates.entity';

@Injectable()
export class CreatorCommentLikeService {
  constructor(
    @InjectRepository(CreatorCommentLikesEntity)
    private readonly creatorCommentsLikesRepository: Repository<CreatorCommentLikesEntity>,
    @InjectRepository(CreatorCommentHatesEntity)
    private readonly creatorCommentsHatesRepository: Repository<CreatorCommentHatesEntity>,
  ) {}

  // commentId, userIp가 좋아요 한 기록 찾기
  private async findLike(commentId: number, userIp: string): Promise<any> {
    return this.creatorCommentsLikesRepository.findOne({
      where: { commentId, userIp },
    });
  }

  // commentId, userIp가 싫어요 한 기록 찾기
  private async findHate(commentId: number, userIp: string): Promise<any> {
    return this.creatorCommentsHatesRepository.findOne({
      where: { commentId, userIp },
    });
  }

  // likeEntity 삭제
  private async removeLikeEntity(likeEntity: CreatorCommentLikesEntity) {
    return this.creatorCommentsLikesRepository.remove(likeEntity);
  }

  // hateEntity 삭제
  private async removeHateEntity(hateEntity: CreatorCommentHatesEntity) {
    return this.creatorCommentsHatesRepository.remove(hateEntity);
  }

  // 좋아요 생성
  // 기존에 싫어요를 했던 댓글인 경우 싫어요 취소
  async like(commentId: number, userIp: string): Promise<any> {
    try {
      const exLike = await this.findLike(commentId, userIp);
      if (exLike) {
        throw new BadRequestException(`ip ${userIp} already liked comment ${commentId}`);
      }

      const exHate = await this.findHate(commentId, userIp);
      if (exHate) {
        await this.removeHateEntity(exHate);
      }

      return this.creatorCommentsLikesRepository.save({ commentId, userIp });
    } catch (error) {
      console.error(error);
      if (error.code === 400) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }

  // 좋아요 삭제
  async removeLike(commentId: number, userIp: string): Promise<any> {
    try {
      const exLike = await this.findLike(commentId, userIp);
      if (!exLike) {
        throw new BadRequestException(`userIp ${userIp} did not like on commentId ${commentId}`);
      }
      return this.removeLikeEntity(exLike);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in remove like on commentId : ${commentId}`);
    }
  }

  // 싫어요 생성
  // 기존에 좋아요 했던 댓글이면 좋아요 취소
  async hate(commentId: number, userIp: string): Promise<any> {
    try {
      const exHate = await this.creatorCommentsHatesRepository.findOne({
        where: { commentId, userIp },
      });
      if (exHate) {
        throw new BadRequestException(`ip ${userIp} already hated comment ${commentId}`);
      }

      const exLike = await this.findLike(commentId, userIp);
      if (exLike) {
        await this.removeLikeEntity(exLike);
      }
      return this.creatorCommentsHatesRepository.save({ commentId, userIp });
    } catch (error) {
      console.error(error);
      if (error.code === 400) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException(error, `error in create hate on commentId : ${commentId}`);
    }
  }

  // 싫어요 삭제
  async removeHate(commentId: number, userIp: string): Promise<any> {
    try {
      const exHate = await this.findHate(commentId, userIp);
      if (!exHate) {
        throw new BadRequestException(`userIp ${userIp} did not hate on commentId ${commentId}`);
      }
      return this.removeLikeEntity(exHate);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }

  // userIp가 좋아요 한 코멘트 id 목록 반환
  async findLikesByUserIp(userIp: string): Promise<any> {
    try {
      const data = await this.creatorCommentsLikesRepository.find({
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
  async findHatesByUserIp(userIp: string): Promise<any> {
    try {
      const data = await this.creatorCommentsHatesRepository.find({
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
