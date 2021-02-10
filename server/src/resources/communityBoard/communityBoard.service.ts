import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
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

  private PLATFORM_CODE = {
    afreeca: 0,
    twitch: 1,
  }

  // 게시글 일반글, 공지글 구분용
  private POST_CATEGORY_CODE = {
    normal: 0,
    notice: 1,
  }

  private getPlatformCode = (platform: string): number => this.PLATFORM_CODE[platform]

  async checkPostPassword(postId: number, password: string): Promise<boolean> {
    try {
      const post = await this.communityPostRepository.findOne({ postId }, { select: ['password'] });
      const passwordInDb = post.password;
      return bcrypt.compare(password, passwordInDb);
    } catch (e) {
      throw new HttpException('no post with that postId', HttpStatus.BAD_REQUEST);
    }
  }

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

  async findAllPosts({
    platform, page, take, category,
  }: {
    platform: string,
    page: number,
    take: number,
    category: string
  }): Promise<{posts: CommunityPostEntity[], total: number}> {
    // 리턴값은 {posts, total, }
    try {
      let option: FindManyOptions<CommunityPostEntity> = {
        where: { platform: this.getPlatformCode(platform) },
        take,
        skip: (page - 1) * take,
        order: { createDate: 'DESC' },
      };

      if (category === 'notice') {
        // 공지사항만
        option = {
          ...option,
          where: {
            category: this.POST_CATEGORY_CODE[category],
            platform: this.getPlatformCode(platform),
          },
        };
      } if (category === 'recommended') {
        // 추천글만
        option = {
          ...option,
          where: {
            platform: this.getPlatformCode(platform),
          },
          order: { recommend: 'DESC' },
        };
      } else {
        // 일반글
        option = {
          ...option,
          where: {
            platform: this.getPlatformCode(platform),
          },
        };
      }

      const [result, total] = await this.communityPostRepository.findAndCount(option);
      return {
        posts: result,
        total,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('error in find all posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOnePost(postId: number): Promise<CommunityPostEntity> {
    const post = await this.communityPostRepository.findOne({ postId });
    if (!post) {
      throw new HttpException('no post with that postId', HttpStatus.BAD_REQUEST);
    }
    return post;
  }

  async updateOnePost(
    postId: number,
    updateCommunityPostDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    const { password } = updateCommunityPostDto;
    const isValidPassword = await this.checkPostPassword(postId, password);
    if (isValidPassword) {
      const post = await this.findOnePost(postId);
      try {
        return this.communityPostRepository.save({
          ...post,
          ...updateCommunityPostDto,
        });
      } catch (error) {
        console.error(error);
        throw new HttpException('error in updateOnePost', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException('not valid password', HttpStatus.UNAUTHORIZED);
    }
  }

  // 개별 글 조회시 조회수+1 한 후 해당 글 리턴
  async hitAndFindOnePost(postId: number): Promise<CommunityPostEntity> {
    const post = await this.findOnePost(postId);
    const hitCount = post.hit;
    try {
      return this.communityPostRepository.save({
        ...post,
        hit: hitCount + 1,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('error in hitAndFindOnePost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeOnePost(postId: number, password: string): Promise<boolean> {
    const isValidPassword = await this.checkPostPassword(postId, password);
    if (isValidPassword) {
      const post = await this.findOnePost(postId);
      try {
        await this.communityPostRepository.remove(post);
        return true;
      } catch (error) {
        console.error(error);
        throw new HttpException('error in removeOnePost', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException('not valid password', HttpStatus.UNAUTHORIZED);
    }
  }

  async recommendPost(postId: number): Promise<CommunityPostEntity> {
    const post = await this.findOnePost(postId);
    const recommendCount = post.recommend;
    try {
      return await this.communityPostRepository.save({
        ...post,
        recommend: recommendCount + 1,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('error in recommendPost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
