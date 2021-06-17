import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyPostsRes, MyCommentsRes } from '@truepoint/shared/dist/res/UserPropertiesResType.interface';
import { UserEntity } from './entities/user.entity';

const BOARD_PLATFORM_NAME = {
  0: { ko: '아프리카 게시판', en: 'afreeca' },
  1: { ko: '트위치 게시판', en: 'twitch' },
  2: { ko: '자유 게시판', en: 'free' },
};

@Injectable()
export class UserPropertiesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findUserPosts({ userId, page, itemPerPage }: {
    userId: string,
    page: number,
    itemPerPage: number
  }): Promise<MyPostsRes> {
    try {
      const start = ((page - 1) * itemPerPage); // offset
      const end = start + itemPerPage;

      const user = await this.usersRepository.findOne({
        where: [{ userId }],
        relations: [
          'communityPosts',
          'featureSuggestions',
        ],
      });

      const allPosts = [
        ...user.communityPosts.map((post) => ({
          to: `/community-board/${BOARD_PLATFORM_NAME[post.platform].en}/view/${post.postId}`, // community-board/:platform/view/:postId
          // platform: post.platform, // : '아프리카=0, 트위치=1, 자유게시판=2 플랫폼 구분용 컬럼'
          postId: post.postId,
          title: post.title,
          createDate: post.createDate,
          belongTo: BOARD_PLATFORM_NAME[post.platform].ko,
        })),
        ...user.featureSuggestions.map((post) => ({
          to: `/feature-suggestion/read/${post.suggestionId}`, // /feature-suggestion/read/:spostId
          postId: post.suggestionId,
          title: post.title,
          createDate: post.createdAt,
          belongTo: '기능제안 게시판',
        })),
      ].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()); // 내림차순 정렬

      const totalCount = allPosts.length;
      const totalPage = Math.ceil(totalCount / itemPerPage);
      const posts = allPosts.slice(start, end);

      return {
        totalCount,
        totalPage,
        hasMore: page < totalPage,
        posts,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in findUserPosts - userId: ${userId}`);
    }
  }

  async findUserComments({ userId, page, itemPerPage }: {
    userId: string,
    page: number,
    itemPerPage: number
  }): Promise<MyCommentsRes> {
    try {
      const start = ((page - 1) * itemPerPage); // offset
      const end = start + itemPerPage;

      const user = await this.usersRepository.createQueryBuilder('user')
        .where('user.userId = :userId', { userId })
        .leftJoinAndSelect('user.communityReplies', 'communityReplies', 'communityReplies.deleteFlag = 0')
        .leftJoinAndSelect('communityReplies.post', 'post')
        .leftJoinAndSelect('user.creatorComments', 'creatorComments', 'creatorComments.deleteFlag = 0')
        .leftJoinAndSelect('user.streamComments', 'streamComments', 'streamComments.deleteFlag = 0')
        .leftJoinAndSelect('streamComments.stream', 'stream')
        .leftJoinAndSelect('user.featureSuggestionReplies', 'featureSuggestionReplies')
        .getOne();

      const allComments = [
        ...user.communityReplies.map((comment) => ({
          to: `/community-board/${BOARD_PLATFORM_NAME[comment.post.platform].en}/view/${comment.post.postId}/#commentId-${comment.parentReplyId || comment.replyId}`, // TODO: 특정 댓글로 이동
          commentId: comment.replyId,
          createDate: comment.createDate,
          content: comment.content,
          belongTo: BOARD_PLATFORM_NAME[comment.post.platform].ko,
        })),
        ...user.creatorComments.map((comment) => ({
          to: `/ranking/creator/${comment.creatorId}/#commentId-${comment.parentCommentId || comment.commentId}`, // TODO: 해당 댓글로 이동하기
          commentId: comment.commentId,
          createDate: comment.createDate,
          content: comment.content,
          belongTo: '인방랭킹 방송인 프로필 게시판',
        })),
        ...user.streamComments.map((comment) => ({
          to: `/ranking/${comment.stream.creatorId}/stream/${comment.streamId}/#commentId-${comment.parentCommentId || comment.commentId}`, // TODO: 해당 댓글로 이동하기
          commentId: comment.commentId,
          createDate: comment.createDate,
          content: comment.content,
          belongTo: '인방랭킹 방송 후기 게시판',
        })),
        ...user.featureSuggestionReplies.map((comment) => ({
          to: `/feature-suggestion/read/${comment.suggestionId}`,
          commentId: comment.replyId,
          createDate: comment.createdAt,
          content: comment.content,
          belongTo: '기능제안 게시판',
        })),
      ].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());// 내림차순 정렬

      const totalCount = allComments.length;
      const totalPage = Math.ceil(totalCount / itemPerPage);
      const comments = allComments.slice(start, end);

      return {
        totalCount,
        totalPage,
        hasMore: page < totalPage,
        comments,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in findUserPosts - userId: ${userId}`);
    }
  }
}
