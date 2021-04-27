import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException, HttpStatus, Injectable, InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import { CreateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/createReply.dto';
import { UpdateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/updateReply.dto';
import { CommunityReplyEntity } from './entities/community-reply.entity';
@Injectable()
export class CommunityReplyService {
  constructor(
    @InjectRepository(CommunityReplyEntity)
    private readonly communityReplyRepository: Repository<CommunityReplyEntity>,
  ) {}

  async findOneReply(replyId: number): Promise<CommunityReplyEntity> {
    const reply = await this.communityReplyRepository.findOne({ replyId });
    if (!reply) {
      throw new HttpException('no reply with that replyId', HttpStatus.NOT_FOUND);
    }
    return reply;
  }

  async checkReplyPassword(replyId: number, password: string): Promise<boolean> {
    try {
      const reply = await this.communityReplyRepository.findOne({ replyId }, { select: ['password'] });
      const passwordInDb = reply.password;
      return bcrypt.compare(password, passwordInDb);
    } catch (e) {
      throw new HttpException('no reply with that replyId', HttpStatus.NOT_FOUND);
    }
  }

  async createReply(postId: number, createReplyDto: CreateReplyDto, ip: string): Promise<CommunityReplyEntity> {
    try {
      const { password } = createReplyDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const reply = await this.communityReplyRepository.save({
        ...createReplyDto,
        password: hashedPassword,
        postId,
        ip,
      });
      return reply;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in createReply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createChildReply({
    parentReplyId,
    createReplyDto,
    ip,
  }: {
    parentReplyId: number,
    createReplyDto: CreateReplyDto,
    ip: string,
  }): Promise<CommunityReplyEntity> {
    const parentReply = await this.findOneReply(parentReplyId);
    const targetPostId = parentReply.postId;
    const { password } = createReplyDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const childReply = await this.communityReplyRepository.save({
        ...createReplyDto,
        password: hashedPassword,
        postId: targetPostId,
        parentReplyId: parentReply.replyId,
        ip,
      });
      return childReply;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async report(replyId: number): Promise<boolean> {
    const reply = await this.findOneReply(replyId);
    try {
      await this.communityReplyRepository.save({
        ...reply,
        reportCount: reply.reportCount + 1,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateReply(replyId: number, updateReplyDto: UpdateReplyDto): Promise<CommunityReplyEntity> {
    const { content } = updateReplyDto;
    const reply = await this.findOneReply(replyId);
    try {
      return this.communityReplyRepository.save({
        ...reply,
        content,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('error in update reply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeReply(replyId: number): Promise<boolean> {
    try {
      const reply = await this.findOneReply(replyId);
      await this.communityReplyRepository.remove(reply);
      return true;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in removeReply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findChildReplies(
    parentReplyId: number,
  ): Promise<CommunityReplyEntity[]> {
    try {
      const childrenReplies = await this.communityReplyRepository.find({
        where: {
          parentReplyId,
          deleteFlag: false,
        },
        order: {
          createDate: 'DESC',
        },
      });
      return childrenReplies;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findReplies({ postId, page, take }: {
    postId: number,
    page: number,
    take: number
  }): Promise<FindReplyResType> {
    try {
      const totalCount = await this.communityReplyRepository.count({
        where: {
          postId,
          deleteFlag: 0,
          parentReplyId: null,
        },
      });

      const replies = await this.communityReplyRepository.createQueryBuilder('reply')
        .select()
        .loadRelationCountAndMap('reply.childrenComments', 'reply.childrenComments')
        .where('reply.postId =:postId', { postId })
        .andWhere('reply.deleteFlag = 0')
        .andWhere('reply.parentReplyId IS NULL')
        .orderBy('reply.createDate', 'DESC')
        .offset((page - 1) * take)
        .limit(take)
        .getMany();
      return {
        replies,
        total: totalCount,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(`error in find replies on postId ${postId}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
