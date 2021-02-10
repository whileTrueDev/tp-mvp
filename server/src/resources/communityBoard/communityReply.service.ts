import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException, HttpStatus, Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

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
    const reply = await this.communityReplyRepository.findOne({ replyId }, { select: ['password'] });
    const passwordInDb = reply.password;

    return bcrypt.compare(password, passwordInDb);
  }

  async createReply(createReplyDto: CreateReplyDto, ip: string): Promise<CommunityReplyEntity> {
    try {
      const { password } = createReplyDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const reply = await this.communityReplyRepository.save({
        ...createReplyDto,
        password: hashedPassword,
        ip,
      });
      return reply;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in createReply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateReply(replyId: number, updateReplyDto: UpdateReplyDto): Promise<CommunityReplyEntity> {
    const { password, content } = updateReplyDto;
    const isValidPassword = await this.checkReplyPassword(replyId, password);
    if (isValidPassword) {
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
    } else {
      throw new HttpException('not valid password', HttpStatus.UNAUTHORIZED);
    }
  }
}
