import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { CommunityPostEntity } from './entities/community-post.entity';

@Injectable()
export class CommunityBoardService {
  constructor(
    @InjectRepository(CommunityPostEntity)
    private readonly communityPostRepository: Repository<CommunityPostEntity>,
  ) {}

  async createOnePost(createCommunityPostDto: CreateCommunityPostDto, ip: string): Promise<CommunityPostEntity> {
    try {
      // 비밀번호 암호화
      const { password } = createCommunityPostDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const postData = {
        ...createCommunityPostDto,
        password: hashedPassword,
        ip,
      };
      const post = await this.communityPostRepository.save(postData);
      return post;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // findAll() {
  //   return `This action returns all communityBoard`;
  // }

  async findOnePost(postId: number): Promise<CommunityPostEntity> {
    try {
      const post = await this.communityPostRepository.findOne({ postId });
      if (!post) {
        throw new HttpException('no post with that postId', HttpStatus.BAD_REQUEST);
      }
      return post;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in find one post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOnePost(
    postId: number,
    updateCommunityPostDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    const post = await this.findOnePost(postId);
    return this.communityPostRepository.save({
      ...post,
      ...updateCommunityPostDto,
    });
    return post;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} communityBoard`;
  // }
}
