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
} from '@nestjs/common';
import { CreateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/createCommunityPost.dto';
import { UpdateCommunityPostDto } from '@truepoint/shared/dist/dto/communityBoard/updateCommunityPost.dto';
import { CreateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/createReply.dto';
import { UpdateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/updateReply.dto';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { RealIP } from 'nestjs-real-ip';
import { Address6 } from 'ip-address';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityReplyService } from './communityReply.service';
import { CommunityPostEntity } from './entities/community-post.entity';
import { CommunityReplyEntity } from './entities/community-reply.entity';

// ip주소가 ipv6으로 들어오는데ipv4 로 address family 바꾸는 방법 못찾아서
// ipv6주소를 ipv4로 변환하는 함수
function ipv6ToIpv4(ipv6: string): string {
  const address = new Address6(ipv6);
  const teredo = address.inspectTeredo();
  const ipv4 = teredo.client4; // 255.255.255.254

  const ipToSave = ipv4.split('.').slice(0, 2).join('.');// 255.255 처럼 잘라서 저장
  return ipToSave;
}

// type FindedPost = {
//   postNumber: number;
// } & Partial<CommunityPostEntity>
// interface FindPostResType{
//   posts: FindedPost[];
//   total: number;
// }

@Controller('community')
export class CommunityBoardController {
  constructor(
    private readonly communityBoardService: CommunityBoardService,
    private readonly communityReplyService: CommunityReplyService,
  ) {}

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
  ): Promise<{replies: CommunityReplyEntity[], total: number}> {
    return this.communityReplyService.findReplies({
      postId,
      page: page < 1 ? 1 : page,
      take: take < 0 ? 10 : take,
    });
  }

  /**
   * 게시글 조회 GET /community/posts?platform=&page=&take=&category=
   * @param platform 'afreeca' | 'twitch' 플랫폼 구분
   * @param category 'all' | 'notice' | 'recommended' 전체글, 공지글, 추천글 조회용
   * @param page 보여질 페이지
   * @param take 해당 페이지에 보여지는 글의 개수
   */
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
      return this.communityBoardService.findPostContainsText({
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
    @RealIP() ip: string,
    @Body() createCommunityPostDto: CreateCommunityPostDto,
  ): Promise<CommunityPostEntity> {
    return this.communityBoardService.createOnePost(createCommunityPostDto, ipv6ToIpv4(ip));
  }

  /**
   * 게시글 추천 POST /community/posts/:postId/recommend
   * @param postId 
   */
  @Post('posts/:postId/recommend')
  recommendPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.communityBoardService.recommendPost(postId);
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
   * 단일 글 조회 - 글 목록에서 단일 글 선택시 GET /community/posts/:postId
   * @param postId 
   */
  @Get('posts/:postId')
  findOne(@Param('postId', ParseIntPipe) postId: number): Promise<CommunityPostEntity> {
    return this.communityBoardService.hitAndFindOnePost(postId);
  }

  /**
   * 단일 글 조회 - 글 수정시 글 내용 가져오기 위해
   * @param postId 
   */
  @Get('posts/edit/:postId')
  findOneForEdit(@Param('postId', ParseIntPipe) postId: number): Promise<CommunityPostEntity> {
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
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityBoardService.removeOnePost(postId, password);
  }

  /**
   * 댓글 생성 POST /community/replies
   * @param request 
   * @param createReplyDto 
   *          nickname: string; 12자
              password: string; 4자
              content: string; 100자
              postId: number;
   */
  @Post('replies')
  @UsePipes(new ValidationPipe({ transform: true }))
  createReply(
    @RealIP() ip: string,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<CommunityReplyEntity> {
    return this.communityReplyService.createReply(createReplyDto, ipv6ToIpv4(ip));
  }

  /**
   * 댓글삭제 DELETE /community/replies/:replyId
   * @param replyId 삭제할 댓글 id
   * @param password 댓글 비밀번호
   */
  @Delete('replies/:replyId')
  async removeReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.communityReplyService.removeReply(replyId, password);
  }

  /**
   * 댓글 수정 PUT /community/replies/:replyId
   * @param updateReplyDto 
   *   password: string;
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
}
