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
      const [comments, count] = await this.creatorCommentsRepository.findAndCount({
        where: {
          creatorId,
        },
        relations: ['likes', 'hates'],
        skip,
        take: 10,
        order: { createDate: 'DESC' },
      });
      return { comments, count };
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
