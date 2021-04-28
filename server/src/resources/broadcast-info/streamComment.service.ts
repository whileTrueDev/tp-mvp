import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '@truepoint/shared/dto/creatorComment/createComment.dto';
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StreamCommentsEntity } from './entities/streamComment.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class StreamCommentService {
  constructor(
    @InjectRepository(StreamCommentsEntity)
    private readonly streamCommentsRepository: Repository<StreamCommentsEntity>,
  ) {}

  // 방송 대댓글 생성
  async createChildrenComment(
    commentId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<StreamCommentsEntity> {
    const parentComment = await this.streamCommentsRepository.findOne({ where: { commentId } });
    if (!parentComment) {
      throw new BadRequestException(`no comment with commentId ${commentId}`);
    }
    try {
      const { password } = createCommentDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newComment = await this.streamCommentsRepository.save({
        ...createCommentDto,
        password: hashedPassword,
        streamId: parentComment.streamId,
        parentCommentId: commentId,
      });
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // 방송 댓글 생성
  async createComment(streamId: string, createCommentDto: CreateCommentDto): Promise<any> {
    try {
      const { password } = createCommentDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newComment = await this.streamCommentsRepository.save({
        ...createCommentDto,
        password: hashedPassword,
        streamId,
      });
      return newComment;
    } catch (error) {
      throw new InternalServerErrorException(error, 'error in createComment');
    }
  }

  // 방송 댓글 조회
  async getStreamComments(streamId: string, skip: number, order: 'recommend'|'date'): Promise<any> {
    try {
      const take = 10;
      const result = {
        comments: [],
        count: 0,
      };

      const baseQueryBuilder = await getConnection()
        .createQueryBuilder()
        .select([
          'C.commentId AS commentId',
          'C.streamId AS streamId',
          'C.userId AS userId',
          'C.nickname AS nickname',
          'C.content AS content',
          'C.createDate AS createDate',
          'C.deleteFlag AS deleteFlag',
          'users.profileImage AS profileImage',
          'COUNT(childrenComments.commentId) AS childrenCount',
          'C.likesCount AS likesCount',
          'C.hatesCount AS hatesCount',
        ])
        .from((subQuery) => subQuery
          .select([
            'comment.commentId AS commentId',
            'comment.streamId AS streamId',
            'comment.userId AS userId',
            'comment.nickname AS nickname',
            'comment.content AS content',
            'comment.createDate AS createDate',
            'comment.deleteFlag AS deleteFlag',
            'IFNULL(SUM(likes.vote), 0) AS likesCount',
            'IFNULL(COUNT(*) - SUM(likes.vote), 0) AS hatesCount',
          ])
          .from(StreamCommentsEntity, 'comment')
          .leftJoin('comment.votes', 'likes')
          .where('comment.streamId = :streamId', { streamId })
          .andWhere('comment.deleteFlag = 0')
          .andWhere('comment.parentCommentId IS NULL')
          .groupBy('comment.commentId'),
        'C')
        .leftJoin(UserEntity, 'users', 'users.userId = C.userId')
        .leftJoin(StreamCommentsEntity, 'childrenComments', '(childrenComments.parentCommentId = C.commentId and childrenComments.deleteFlag = 0)')
        .groupBy('C.commentId');

      const totalCount = await baseQueryBuilder.clone().getRawMany();
      result.count = totalCount.length;

      if (order === 'date') {
        const comments = await baseQueryBuilder
          .orderBy('C.createDate', 'DESC')
          .offset(skip)
          .limit(take)
          .getRawMany();

        result.comments = comments.map((c) => (
          {
            ...c,
            likesCount: Number(c.likesCount),
            hatesCount: Number(c.hatesCount),
            childrenCount: Number(c.childrenCount),
          }
        ));
      }
      if (order === 'recommend') {
        const comments = await baseQueryBuilder
          .orderBy('C.likesCount', 'DESC')
          .addOrderBy('C.createDate', 'DESC')
          .offset(skip)
          .limit(take)
          .getRawMany();
        result.comments = comments.map((c) => (
          {
            ...c,
            likesCount: Number(c.likesCount),
            hatesCount: Number(c.hatesCount),
            childrenCount: Number(c.childrenCount),
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
      const commentBaseQuery = this.streamCommentsRepository.createQueryBuilder('comment')
        .select([
          'comment.commentId AS commentId',
          'comment.streamId AS streamId',
          'comment.userId AS userId',
          'comment.nickname AS nickname',
          'comment.content AS content',
          'comment.createDate AS createDate',
          'comment.deleteFlag AS deleteFlag',
          'users.profileImage AS profileImage',
          'IFNULL(SUM(likes.vote), 0) AS likesCount',
          'IFNULL(COUNT(*) - SUM(likes.vote), 0) AS hatesCount',
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

  // 방송 댓글 삭제하기 - deleteFlag를 true로
  async deleteOneComment(commentId: number): Promise<boolean> {
    try {
      const comment = await this.streamCommentsRepository.findOne({
        where: {
          commentId,
        },
      });

      if (!comment) {
        throw new BadRequestException(`no comment with commentId:${commentId}`);
      }
      await this.streamCommentsRepository.save({
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
    const { password: hashedPassword } = await this.streamCommentsRepository.findOne({
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
      const comment = await this.streamCommentsRepository.findOne({ where: { commentId } });
      if (!comment) {
        throw new BadRequestException(`no comment with commentId ${commentId}`);
      }

      await this.streamCommentsRepository.save({
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
