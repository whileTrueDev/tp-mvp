import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
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
    posts: any[],
    total: number,
    page: number,
    take: number,
  ): any[] => posts.map((post, index) => ({ ...post, postNumber: total - ((page - 1) * take) - index }))

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

  async findPostContainsText({
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
      ])
      .where('post.platform = :platform', { platform: this.getPlatformCode(platform) })
      .andWhere(`post.${searchColumn} like :${searchColumn}`, { [searchColumn]: `%${searchText}%` });

    const countQb = qb.clone();
    const resultQb = qb
      .loadRelationCountAndMap('post.replies', 'post.replies')
      .orderBy('post.createDate', 'DESC');

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
    category: string // filter로 바꾸기 이름 헷갈림..
  }): Promise<FindPostResType> {
    // 리턴값은 {posts, total, }

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
      ])
      .where('post.platform = :platform', { platform: this.getPlatformCode(platform) })
      .loadRelationCountAndMap('post.replies', 'post.replies');

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
  }

  // 개별 글 조회시 조회수+1 한 후 해당 글 리턴
  async hitAndFindOnePost(postId: number): Promise<CommunityPostEntity> {
    const post = await this.communityPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.replies', 'replies')
      .where('post.postId = :postId', { postId })
      .getOne();
    if (!post) {
      throw new HttpException('no post with that postId', HttpStatus.NOT_FOUND);
    }

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
}
