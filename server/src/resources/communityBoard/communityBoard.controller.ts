import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Ip,
} from '@nestjs/common';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { UpdateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/updateReply.dto';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { FindReplyResType } from '@truepoint/shared/dist/res/FindReplyResType.interface';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityReplyService } from './communityReply.service';
import { CommunityPostEntity } from './entities/community-post.entity';
import { CommunityReplyEntity } from './entities/community-reply.entity';

@Controller('community')
export class CommunityBoardController {
  constructor(
    private readonly communityBoardService: CommunityBoardService,
    private readonly communityReplyService: CommunityReplyService,
  ) {}

  /**
   * 대댓글 조회 GET /community/replies/child/:replyId
   * 
   */
  @Get('/replies/child/:replyId')
  findChildReplies(
    @Param('replyId', ParseIntPipe) replyId: number,
  ): Promise<CommunityReplyEntity[]> {
    return this.communityReplyService.findChildReplies(replyId);
  }

  /**
   * 댓글조회 GET /community/replies?postId=&page=&take=
   * @param postId 댓글 조회할 글id
   * @param page 댓글 페이지
   * @param take 가져올 댓글 개수
   */
  @Get('replies')
  findReplies(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<FindReplyResType> {
    return this.communityReplyService.findReplies({
      postId,
      page: page < 1 ? 1 : page,
      take: take < 0 ? 10 : take,
    });
  }

  /**
   * 게시글 목록 조회, 글 내용은 포함되어 있지 않음
   * GET /community/posts?platform=&page=&take=&category=
   * @param platform 'afreeca' | 'twitch' 플랫폼 구분
   * @param category 'all' | 'notice' | 'recommended' 전체글, 공지글, 추천글 조회용
   * @param page 보여질 페이지
   * @param take 해당 페이지에 보여지는 글의 개수
   * @param qtext 검색어
   * @param qtype 'title' | 'nickname', 제목 검색 | 작성자 검색
   */
  // eslint-disable-next-line max-params
  @Get('posts')
  findAllPosts(
    @Query('platform') platform: string,
    @Query('category') category: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('qtype') searchColumn: string,
    @Query('qtext') searchText: string,
  ): Promise<FindPostResType> {
    if (searchColumn && searchText) {
      return this.communityBoardService.findPostContainsSearchText({
        platform,
        page: page < 1 ? 1 : page,
        take: take < 0 ? 10 : take,
        searchColumn,
        searchText,
      });
    }
    return this.communityBoardService.findAllPosts({
      platform,
      category: category || 'all',
      page: page < 1 ? 1 : page,
      take: take < 0 ? 10 : take,
    });
  }

  /**
   * 게시글 작성 POST /community/posts
   * @param request 
   * @param createCommunityPostDto 
   */
  @Post('posts')
  @UsePipes(new ValidationPipe({ transform: true }))
  createOnePost(
    @Ip() userIp: string,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, userIp);
  }

  /**
   * 게시글 추천 POST /community/posts/:postId/recommend
   * 
   * @param postId 
   * @return 새로운 추천수 리턴
   */
  @Post('posts/:postId/recommend')
  recommendPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<number> {
    return this.communityBoardService.recommendPost(postId);
  }

  /**
   * 게시글 비추천 POST /community/posts/:postId/notRecommend
   * @param postId 
   * @returns 
   */
  @Post('posts/:postId/notRecommend')
  notRecommendPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<number> {
    return this.communityBoardService.notRecommendPost(postId);
  }

  /**
   * 게시글 조회 - 조회수만 올림 POST /community/posts/:postId/hit
   * 
   * @param postId 
   * @return 새로운 조회수 리턴
   */
  @Post('posts/:postId/hit')
  hitPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<number> {
    return this.communityBoardService.hitPost(postId);
  }

  /**
   * 게시글 수정 PUT /community/posts/:postId
   * @param postId 
   * @param updateCommunityBoardDto 
   *    title: string;
        content: string;
   */
  @Put('posts/:postId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateOnePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateCommunityBoardDto: UpdateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.updateOnePost(postId, updateCommunityBoardDto);
  }

  /**
   * 단일 글 조회 - 글 내용 리턴  GET /community/posts/:postId
   * @param postId 
   */
  @Get('posts/:postId')
  findOne(@Param('postId', ParseIntPipe) postId: number): Promise<CommunityPostEntity> {
    return this.communityBoardService.findOnePost(postId);
  }

  /**
   * 글 수정시 비밀번호 확인
   * @param postId 
   * @param password 
   */
  @HttpCode(200)
  @Post('posts/:postId/password')
  async checkPostPassword(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityBoardService.checkPostPassword(postId, password);
  }

  /**
   * 글 삭제 DELETE /community/posts/:postId
   * @param postId 
   */
  @Delete('posts/:postId')
  removeOnePost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<boolean> {
    return this.communityBoardService.removeOnePost(postId);
  }

  /**
   * 댓글 수정 PUT /community/replies/:replyId
   * @param updateReplyDto 
       content: string; 100자 제한
   */
  @Put('replies/:replyId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.updateReply(replyId, updateReplyDto);
  }

  /**
   * 댓글 생성 POST /community/replies
   * @param request 
   * @param createReplyDto 
   *          nickname: string; 12자
              password: string; 4자
              content: string; 100자
   */
  @Post('/posts/:postId/replies')
  @UsePipes(new ValidationPipe())
  createReply(
    @Ip() userIp: string,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createReplyDto: CreateCommentDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.createReply(postId, createReplyDto, userIp);
  }

  @Post('replies/child/:replyId')
  @UsePipes(new ValidationPipe())
  createChildReply(
    @Ip() userIp: string,
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() createReplyDto: CreateCommentDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.createChildReply({
      parentReplyId: replyId,
      createReplyDto,
      ip: userIp,
    });
  }

  /**
   * 댓글 수정,삭제시 비밀번호 확인
   * @param postId 
   * @param password 
   */
  @HttpCode(200)
  @Post('replies/:replyId/password')
  async checkReplyPassword(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityReplyService.checkReplyPassword(replyId, password);
  }

  /**
   * 대댓글 생성 POST /replies/report/:replyId
   * @param replyId 
   * @returns 
   */
  @Post('replies/report/:replyId')
  async reportReply(
    @Param('replyId', ParseIntPipe) replyId: number,
  ): Promise<boolean> {
    return this.communityReplyService.report(replyId);
  }

  /**
   * 댓글삭제 DELETE /community/replies/:replyId
   * @param replyId 삭제할 댓글 id
   * @param password 댓글 비밀번호
   */
  @Delete('replies/:replyId')
  async removeReply(
    @Param('replyId', ParseIntPipe) replyId: number,
  ): Promise<boolean> {
    return this.communityReplyService.removeReply(replyId);
  }
}
