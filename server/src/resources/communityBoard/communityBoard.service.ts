import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt';
import { CommunityPostEntity } from './entities/community-post.entity';
import { CreateCommunityPostDto } from './dto/createCommunityPost.dto';
// import { UpdateCommunityPostDto } from './dto/updateCommunityPost.dto';

@Injectable()
export class CommunityBoardService {
  constructor(
    @InjectRepository(CommunityPostEntity)
    private readonly communityPostRepository: Repository<CommunityPostEntity>,
  ) {}

  async create(createCommunityPostDto: CreateCommunityPostDto): Promise<CommunityPostEntity> {
    // 비밀번호 암호화
    return this.communityPostRepository.save(createCommunityPostDto);
  }

  // findAll() {
  //   return `This action returns all communityBoard`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} communityBoard`;
  // }

  // update(id: number, updateCommunityPostDto: UpdateCommunityPostDto) {
  //   return `This action updates a #${id} communityBoard`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} communityBoard`;
  // }
}
