import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { S3Service } from '../s3/s3.service';
import { CommunityPostEntity } from './entities/community-post.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CommunityBoardService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(CommunityPostEntity)
    private readonly communityPostRepository: Repository<CommunityPostEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private PLATFORM_CODE = {
    afreeca: 0,
    twitch: 1,
    free: 2,
  }

  // 게시글 일반글, 공지글 구분용
  private POST_CATEGORY_CODE = {
    normal: 0,
    notice: 1,
  }

  /**
   * 'afreeca' | 'twitch' 문자열을 대응되는 플랫폼코드 0, 1로 변환
   * @param platform 'afreeca' | 'twitch'
   */
  private getPlatformCode = (platform: string): number => this.PLATFORM_CODE[platform]

  /**
   * 'normal'|'notice' 문자열을 대응되는 글카테고리 구분 코드 0,1로 변환
   * @param category 'normal'|'notice'
   */
  private getPostCategoryCode = (category: string): number => this.POST_CATEGORY_CODE[category]

  /**
   * 응답 보낼 posts에 글번호 매기는 함수
   * @param posts post 배열
   * @param total 요청에 맞는 글의 총 개수
   * @param page 요청한 페이지
   * @param take 요청한 글의 개수
   */
  private numberingPosts = (
    posts: CommunityPostEntity[],
    total: number,
    page: number,
    take: number,
  ): any[] => posts.map((post, index) => (
    {
      ...post,
      postNumber: total - ((page - 1) * take) - index,
      // postNumber: post.postId,
    }))

  async checkPostPassword(postId: number, password: string): Promise<boolean> {
    try {
      const post = await this.communityPostRepository.findOne({ postId }, { select: ['password'] });
      const passwordInDb = post.password;
      return bcrypt.compare(password, passwordInDb);
    } catch (e) {
      throw new HttpException('no post with that postId', HttpStatus.BAD_REQUEST);
    }
  }

  // 시그니쳐로 변경된 이미지를 S3로 저장 및 URL 변경
  async saveResources(createCommunityPostDto: CreateCommunityPostDto | UpdateCommunityPostDto): Promise<string> {
    // await
    let { content } = createCommunityPostDto;
    if (!Object.prototype.hasOwnProperty.call(createCommunityPostDto, 'resources')) {
      return content;
    }
    await Promise.all(
      createCommunityPostDto.resources.map(async ({
        fileName, src, signature,
      }: {
        fileName: string,
        src: string,
        signature: string
      }): Promise<void> => {
        // 파일명 해싱
        const hashName = await bcrypt.hash(fileName, 1);
        // 파일 저장
        const imageUrl = await this.s3Service.uploadBase64ImageToS3(
          `community-board/${hashName.slice(0, 15)}`, src,
        );
        // replace 
        content = content.replace(signature, imageUrl);
      }),
    );
    return content;
  }

  async createOnePost(createCommunityPostDto: CreateCommunityPostDto, ip: string): Promise<CommunityPostEntity> {
    try {
      // 비밀번호 암호화
      const { password } = createCommunityPostDto;
      const content = await this.saveResources(createCommunityPostDto);
      const hashedPassword = await bcrypt.hash(password, 10);
      let user: UserEntity;

      const { userId } = createCommunityPostDto;

      if (userId) {
        user = await this.usersRepository.findOne({ where: { userId } });
      }
      const postData = {
        ...createCommunityPostDto,
        content,
        password: hashedPassword,
        ip,
        author: user,
      };
      const post = await this.communityPostRepository.save(postData);
      return post;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPostContainsSearchText({
    platform, page, take, searchColumn, searchText,
  }: {
    platform: string,
    page: number,
    take: number,
    searchColumn: string,
    searchText: string,
  }): Promise<FindPostResType> {
    const qb = this.communityPostRepository
      .createQueryBuilder('post')
      .select([
        'post.postId',
        'post.title',
        'post.nickname',
        'post.ip',
        'post.createDate',
        'post.platform',
        'post.category',
        'post.hit',
        'post.recommend',
        'post.userId',
      ])
      .where('post.platform = :platform', { platform: this.getPlatformCode(platform) })
      .andWhere(`post.${searchColumn} like :${searchColumn}`, { [searchColumn]: `%${searchText}%` });

    const countQb = qb.clone();
    const resultQb = qb
      .loadRelationCountAndMap(
        'post.repliesCount',
        'post.replies',
        'replies',
        (sqb) => sqb.andWhere('replies.deleteFlag = 0'),
      ).orderBy('post.createDate', 'DESC');

    try {
      const posts = await resultQb.skip((page - 1) * take)
        .take(take)
        .getMany();
      const total = await countQb.getCount();
      return {
        posts: this.numberingPosts(posts, total, page, take),
        total,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('error in find all posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPosts({
    platform, page, take, category,
  }: {
    platform: string,
    page: number,
    take: number,
    category: string
  }): Promise<FindPostResType> {
    const qb = this.communityPostRepository
      .createQueryBuilder('post')
      .select([
        'post.postId',
        'post.title',
        'post.nickname',
        'post.ip',
        'post.createDate',
        'post.platform',
        'post.category',
        'post.hit',
        'post.recommend',
        'post.userId',
      ])
      .where('post.platform = :platform', { platform: this.getPlatformCode(platform) })
      .loadRelationCountAndMap(
        'post.repliesCount',
        'post.replies',
        'replies',
        (sqb) => sqb.andWhere('(replies.deleteFlag = 0)'),
      );

    let resultQb = qb.clone();
    let countQb = qb.clone();

    if (category === 'notice') {
      // 공지사항만
      resultQb = qb
        .andWhere('post.category = :category', { category: this.getPostCategoryCode('notice') })
        .orderBy('post.createDate', 'DESC');

      countQb = resultQb.clone();
    } else if (category === 'recommended') {
      // 추천글, 추천 10개 이상인 일반글만
      const recommendCriteria = 10;

      resultQb = qb
        .andWhere('post.category = :category', { category: this.getPostCategoryCode('normal') })
        .andWhere('post.recommend >= :recommendCriteria', { recommendCriteria })
        .orderBy('post.recommend', 'DESC')
        .addOrderBy('post.createDate', 'DESC');

      countQb = resultQb.clone();
    } else {
      // 일반글만
      resultQb = qb
        .andWhere('post.category = :category', { category: this.getPostCategoryCode('normal') })
        .orderBy('post.createDate', 'DESC');

      countQb = resultQb.clone();
    }

    try {
      const posts = await resultQb.skip((page - 1) * take)
        .take(take)
        .getMany();
      const total = await countQb.getCount();

      return {
        posts: this.numberingPosts(posts, total, page, take),
        total,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('error in find all posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOnePost(postId: number): Promise<CommunityPostEntity> {
    const post = await this.communityPostRepository.findOne(
      { postId },
    );
    if (!post) {
      throw new HttpException('no post with that postId', HttpStatus.BAD_REQUEST);
    }
    return post;
  }

  async updateOnePost(
    postId: number,
    updateCommunityPostDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    const content = await this.saveResources(updateCommunityPostDto);
    const post = await this.findOnePost(postId);
    try {
      return this.communityPostRepository.save({
        ...post,
        ...updateCommunityPostDto,
        content,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('error in updateOnePost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeOnePost(postId: number): Promise<boolean> {
    const post = await this.findOnePost(postId);
    try {
      await this.communityPostRepository.remove(post);
      return true;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in removeOnePost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async hitPost(postId: number): Promise<number> {
    const post = await this.findOnePost(postId);
    const hitCount = post.hit;
    try {
      const savedPost = await this.communityPostRepository.save({
        ...post,
        hit: hitCount + 1,
      });
      return savedPost.hit;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in hitPost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async recommendPost(postId: number): Promise<number> {
    const post = await this.findOnePost(postId);
    const recommendCount = post.recommend;
    try {
      const savedPost = await this.communityPostRepository.save({
        ...post,
        recommend: recommendCount + 1,
      });
      return savedPost.recommend;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in recommendPost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async notRecommendPost(postId: number): Promise<number> {
    const post = await this.findOnePost(postId);
    const { notRecommendCount } = post;
    try {
      const savedPost = await this.communityPostRepository.save({
        ...post,
        notRecommendCount: notRecommendCount + 1,
      });
      return savedPost.notRecommendCount;
    } catch (error) {
      console.error(error);
      throw new HttpException('error in not recommend post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
