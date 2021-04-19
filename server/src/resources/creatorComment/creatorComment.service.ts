import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { ICreatorCommentsRes } from '@truepoint/shared/dist/res/CreatorCommentResType.interface';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { UserEntity } from '../users/entities/user.entity';
@Injectable()
export class CreatorCommentService {
  constructor(
    @InjectRepository(CreatorCommentsEntity)
    private readonly creatorCommentsRepository: Repository<CreatorCommentsEntity>,
  ) {}

  // 방송인 평가 대댓글 생성(자식 댓글 생성)
  async createChildrenComment(
    commentId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CreatorCommentsEntity> {
    const parentComment = await this.creatorCommentsRepository.findOne({ where: { commentId } });
    if (!parentComment) {
      throw new BadRequestException(`no comment with commentId ${commentId}`);
    }
    try {
      const { password } = createCommentDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newComment = await this.creatorCommentsRepository.save({
        ...createCommentDto,
        password: hashedPassword,
        creatorId: parentComment.creatorId,
        parentCommentId: commentId,
      });
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // 방송인 평가 댓글 생성
  async createComment(creatorId: string, createCommentDto: CreateCommentDto): Promise<CreatorCommentsEntity> {
    try {
      const { password } = createCommentDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newComment = await this.creatorCommentsRepository.save({
        ...createCommentDto,
        password: hashedPassword,
        creatorId,
      });
      return newComment;
    } catch (error) {
      throw new InternalServerErrorException(error, 'error in createComment');
    }
  }

  // 방송인 평가댓글 목록 조회
  async getCreatorComments(creatorId: string, skip: number, order: 'recommend'|'date'): Promise<ICreatorCommentsRes> {
    try {
      const take = 10;
      const result: ICreatorCommentsRes = {
        comments: [],
        count: 0,
      };

      const baseQueryBuilder = await this.creatorCommentsRepository.createQueryBuilder('comment')
        .select([
          'comment.commentId AS commentId',
          'comment.creatorId AS creatorId',
          'comment.userId AS userId',
          'comment.nickname AS nickname',
          'comment.content AS content',
          'comment.createDate AS createDate',
          'comment.deleteFlag AS deleteFlag',
          'users.profileImage AS profileImage',
          'COUNT(CASE WHEN likes.vote = 1 THEN 1 END) AS likesCount',
          'COUNT(CASE WHEN likes.vote = 0 THEN 1 END) AS hatesCount',
          'COUNT(childrenComments.commentId) AS childrenCommentCount',
        ])
        .leftJoin(UserEntity, 'users', 'users.userId = comment.userId')
        .leftJoin('comment.votes', 'likes')
        .leftJoin('comment.childrenComments', 'childrenComments')
        .where('comment.creatorId = :creatorId', { creatorId })
        .andWhere('comment.deleteFlag = 0')
        .andWhere('comment.parentCommentId IS NULL')
        .groupBy('comment.commentId');

      const testCount = await baseQueryBuilder.clone().getCount();
      result.count = testCount;

      if (order === 'date') {
        const comments = await baseQueryBuilder
          .orderBy('comment.createDate', 'DESC')
          .offset(skip)
          .limit(take)
          .getRawMany();

        result.comments = comments.map((c) => (
          {
            ...c,
            likesCount: Number(c.likesCount),
            hatesCount: Number(c.hatesCount),
            childrenCommentCount: Number(c.childrenCommentCount),
          }
        ));
      }
      if (order === 'recommend') {
        const comments = await baseQueryBuilder
          .orderBy('COUNT(likes.id)', 'DESC')
          .addOrderBy('comment.createDate', 'DESC')
          .offset(skip)
          .limit(take)
          .getRawMany();
        result.comments = comments.map((c) => (
          {
            ...c,
            likesCount: Number(c.likesCount),
            hatesCount: Number(c.hatesCount),
            childrenCommentCount: Number(c.childrenCommentCount),
          }
        ));
      }

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getCreatorComments');
    }
  }

  // 대댓글 목록 최신순 가져오기
  async getReplies(commentId: number): Promise<any> {
    try {
      const commentBaseQuery = this.creatorCommentsRepository.createQueryBuilder('comment')
        .select([
          'comment.commentId AS commentId',
          'comment.creatorId AS creatorId',
          'comment.userId AS userId',
          'comment.nickname AS nickname',
          'comment.content AS content',
          'comment.createDate AS createDate',
          'comment.deleteFlag AS deleteFlag',
          'users.profileImage AS profileImage',
          'COUNT(CASE WHEN likes.vote = 1 THEN 1 END) AS likesCount',
          'COUNT(CASE WHEN likes.vote = 0 THEN 1 END) AS hatesCount',
        ])
        .leftJoin(UserEntity, 'users', 'users.userId = comment.userId')
        .leftJoin('comment.votes', 'likes')
        .groupBy('comment.commentId');

      const replies = await commentBaseQuery
        .where('comment.parentCommentId = :commentId', { commentId })
        .andWhere('comment.deleteFlag = 0')
        .orderBy('comment.createDate', 'DESC')
        .getRawMany();

      return replies.map((c) => (
        {
          ...c,
          likesCount: Number(c.likesCount),
          hatesCount: Number(c.hatesCount),
        }
      ));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // 방송인 평가댓글 삭제하기 - deleteFlag를 true로
  async deleteOneComment(commentId: number): Promise<boolean> {
    try {
      const comment = await this.creatorCommentsRepository.findOne({
        where: {
          commentId,
        },
      });

      if (!comment) {
        throw new BadRequestException(`no comment with commentId:${commentId}`);
      }
      await this.creatorCommentsRepository.save({
        ...comment,
        deleteFlag: true,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in deleteOneComment, commentId: ${commentId}`);
    }
  }

  // 댓글 비밀번호 확인
  async checkPassword(commentId: number, password: string): Promise<boolean> {
    const { password: hashedPassword } = await this.creatorCommentsRepository.findOne({
      where: {
        commentId,
      },
      select: ['password'],
    });
    return bcrypt.compare(password, hashedPassword);
  }

  // 댓글 신고
  async report(commentId: number): Promise<boolean> {
    try {
      const comment = await this.creatorCommentsRepository.findOne({ where: { commentId } });
      if (!comment) {
        throw new BadRequestException(`no comment with commentId ${commentId}`);
      }

      await this.creatorCommentsRepository.save({
        ...comment,
        reportCount: comment.reportCount + 1,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
