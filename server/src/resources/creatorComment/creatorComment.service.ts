import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
@Injectable()
export class CreatorCommentService {
  constructor(
    @InjectRepository(CreatorCommentsEntity)
    private readonly creatorCommentsRepository: Repository<CreatorCommentsEntity>,
  ) {}

  // 방송인 평가 댓글 생성
  async createComment(creatorId: string, createCommentDto: CreateCommentDto): Promise<any> {
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
  async getCreatorComments(creatorId: string, skip: number, order: 'recommend'|'date'): Promise<any> {
    try {
      const result: {comments: CreatorCommentsEntity[], count: number} = {
        comments: [],
        count: 0,
      };
      if (order === 'date') {
      // 생성일 내림차순
        const [comments, count] = await this.creatorCommentsRepository.createQueryBuilder('comment')
          .loadRelationCountAndMap('comment.hatesCount', 'comment.hates')
          .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
          .where('comment.creatorId = :creatorId', { creatorId })
          .orderBy('comment.createDate', 'DESC')
          .skip(skip)
          .take(10)
          .getManyAndCount();
        result.comments = comments;
        result.count = count;
      }
      if (order === 'recommend') {
        const [comments, count] = await this.creatorCommentsRepository.createQueryBuilder('comment')
          .addSelect('COUNT(likes.id) AS likesCount')
          .leftJoin('comment.likes', 'likes')
          .loadRelationCountAndMap('comment.hatesCount', 'comment.hates')
          .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
          .where('comment.creatorId = :creatorId', { creatorId })
          .groupBy('comment.commentId')
          .orderBy('likesCount', 'DESC')
          .skip(skip)
          .take(10)
          .getManyAndCount();
        result.comments = comments;
        result.count = count;
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getCreatorComments');
    }
  }

  // 방송인 평가댓글 삭제하기
  async deleteOneComment(commentId: number): Promise<any> {
    try {
      const comment = await this.creatorCommentsRepository.findOne({
        where: {
          commentId,
        },
      });

      if (!comment) {
        throw new BadRequestException(`no comment with commentId:${commentId}`);
      }
      await this.creatorCommentsRepository.delete(comment);
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

  // test
  async findAllComments(): Promise<any> {
    return this.creatorCommentsRepository.find({
      relations: ['likes', 'hates'],
    });
  }
}
