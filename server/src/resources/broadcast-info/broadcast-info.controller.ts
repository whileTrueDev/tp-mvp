import { TodayTopViewerUsersRes } from '@truepoint/shared/dist/res/TodayTopViewerUsersRes.interface';
import { CreateStreamVoteDto } from '@truepoint/shared/dist/dto/broadcast-info/CreateStreamVote.dto';
import {
  Body,
  Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query,
} from '@nestjs/common';
import { FindOneStreamDto } from '@truepoint/shared/dist/dto/broadcast-info/FindOneStream.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// service
import { RecentStream, RecentStreamResType } from '@truepoint/shared/res/RecentStreamResType.interface';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';
import { BroadcastInfoService } from './broadcast-info.service';

@Controller('broadcast-info')
export class BroadcastInfoController {
  constructor(private readonly broadcastService: BroadcastInfoService) {}

  /**
   * 방송 정보 조회 GET 라우터
   * @param findDaysStreamRequest 로그인 유저 아이디, 조회 시작 날짜 00시 00분 , 조회 종료 날짜 23시 59분
   */
  @Get()
  // 일시적 가드해제 : 마케팅을 위한 개발 목적
  // @UseGuards(JwtAuthGuard)
  getCompleteStreamsList(
    @Query(new ValidationPipe()) findDaysStreamRequest: SearchCalendarStreams,
  ): Promise<StreamDataType[]> {
    return this.broadcastService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  /**
   * 해당 크리에이터의 최근 방송 정보를 가져옵니다.
   * creatorId (twitch, afreeca 고유 ID) 를 통해 방송 목록을 가져옵니다.
   * @param creatorId 방송목록을 가져올 유저(afreeca,twitch)고유 아이디
   * @param limit 가져올 방송 목록 갯수
   */
  @Get('bycreator')
  async getStreamsByCreatorId(
    @Query('creatorId') creatorId: string,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<RecentStreamResType> {
    const result = await this.broadcastService.getStreamsByCreatorId(creatorId, limit);
    return result;
  }

  /**
   * 방송에 대한 좋아요 / 싫어요를 추가합니다.
   * @param ip 요청자 IP
   * @param dto CreateSteramVoteDto
   * @returns 1 | 0
   */
  @Post('vote')
  vote(@Ip() ip: string, @Body(ValidationPipe) dto: CreateStreamVoteDto): Promise<number> {
    return this.broadcastService.vote({ ...dto, ip });
  }

  /**
   * 방송에대한 좋아요 / 싫어요를 삭제합니다.
   * @param id 삭제할 vote의 고유ID
   */
  @Delete('vote')
  cancelVote(@Query('id') id: number): Promise<number> {
    return this.broadcastService.cancelVote(id);
  }

  /**
   * 관리자페이지 이용자정보 조회탭에서 사용
   * userId를 받아 해당 유저의 전체 방송 목록 조회
   * @param userId 방송목록 조회할 유저의 userId
   */
  @Get('byuser/:userId')
  getStreamsByUserId(@Param('userId') userId: string): Promise<BroadcastDataForDownload[]> {
    return this.broadcastService.getStreamsByUserId(userId);
  }

  /**
   * 플랫폼(아프리카/트위치) 별로 오늘 최고 시청자를 기록한 유저정보를 가져옵니다.
   * @returns {TodayTopViewerUsersRes}
   * @example 데이터 예시 [
      {
          "creatorId": "joey1114",
          "platform": "afreeca",
          "nickName": "저라뎃",
          "viewer": 18056
      },
      {
          "creatorId": "597621638",
          "platform": "twitch",
          "nickName": "소행성612",
          "viewer": 12826
      }
    ]
   */
  @Get('today-top-viewer')
  getTodayTopViewerUserByPlatform(): Promise<TodayTopViewerUsersRes> {
    return this.broadcastService.getTodayTopViewerUserByPlatform();
  }

  /**
   * 1개의 스트림에 대한 정보를 반환
   * @param platform twitch | afreeca
   * @param streamId 
   * @returns 
   */
  @Get('/:streamId')
  async findOneStream(
    @Ip() ip: string,
    @Param(ValidationPipe) params: FindOneStreamDto,
  ): Promise<RecentStream> {
    const {
      streamId,
    } = params;
    const streamData = await this.broadcastService.findOneSteam(streamId);
    const vote = await this.broadcastService.checkIsVotedByIp(ip, streamId);

    if (vote) {
      return {
        ...streamData,
        voteHistory: {
          ...vote,
          type: vote.vote ? 'up' : 'down',
        },
      };
    }
    return streamData;
  }
}
