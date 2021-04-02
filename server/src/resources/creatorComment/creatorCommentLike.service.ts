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

  // 좋아요 생성
  async like(commentId: number, userIp: string): Promise<any> {
    try {
      const exLike = await this.creatorCommentsLikesRepository.findOne({
        where: {
          commentId,
          userIp,
        },
      });
      if (exLike) {
        throw new BadRequestException(`ip ${userIp} already liked comment ${commentId}`);
      }
      return this.creatorCommentsLikesRepository.save({
        commentId,
        userIp,
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
  async removeLike(commentId: number, userIp: string): Promise<any> {
    try {
      return this.creatorCommentsLikesRepository
        .createQueryBuilder('Likes')
        .delete()
        .where('commentId = :commentId', { commentId })
        .andWhere('userIp = :userIp', { userIp })
        .execute();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }

  // 싫어요 생성
  async hate(commentId: number, userIp: string): Promise<any> {
    try {
      const exHate = await this.creatorCommentsHatesRepository.findOne({
        where: {
          commentId,
          userIp,
        },
      });
      if (exHate) {
        throw new BadRequestException(`ip ${userIp} already hated comment ${commentId}`);
      }
      return this.creatorCommentsHatesRepository.save({
        commentId,
        userIp,
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
  async removeHate(commentId: number, userIp: string): Promise<any> {
    try {
      return this.creatorCommentsHatesRepository
        .createQueryBuilder('Hates')
        .delete()
        .where('commentId = :commentId', { commentId })
        .andWhere('userIp = :userIp', { userIp })
        .execute();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in create like on commentId : ${commentId}`);
    }
  }
}
