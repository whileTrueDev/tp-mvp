import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreatorCommentsEntity } from './entities/creatorComment.entity';
import { CreateCommentDto } from './creatorComment.controller';

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

  async getCreatorComments(creatorId: string, skip: number, order: 'recommend'|'date'): Promise<any> {
    try {
      if (order === 'date') {
      // 생성일 내림차순
        const [comments, count] = await this.creatorCommentsRepository.createQueryBuilder('comment')
          .leftJoinAndSelect('comment.likes', 'likes')
          .leftJoinAndSelect('comment.hates', 'hates')
          .loadRelationCountAndMap('comment.hatesCount', 'comment.hates')
          .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
          .where('comment.creatorId = :creatorId', { creatorId })
          .orderBy('comment.createDate', 'DESC')
          .skip(skip)
          .take(10)
          .getManyAndCount();

        return { comments, count };
      }
      if (order === 'recommend') {
        // 수정필요
        // relation 엔티티들이 한개씩만 들어옴 groupby 때문인가??
        const [comments, count] = await this.creatorCommentsRepository.createQueryBuilder('comment')
          .select()
          .addSelect('COUNT(likes.id) AS likesCount')
          .leftJoinAndSelect('comment.likes', 'likes')
          .leftJoinAndSelect('comment.hates', 'hates')
          .groupBy('comment.commentId')
          .orderBy('likesCount', 'DESC')
          .skip(skip)
          .take(10)
          .getManyAndCount();
        return { comments, count };
      }
      return {};
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getCreatorComments');
    }
  }

  async findAllComments(): Promise<any> {
    return this.creatorCommentsRepository.find({
      relations: ['likes', 'hates'],
    });
  }
}
