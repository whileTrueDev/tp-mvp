import {
  Body,
  Controller, Delete, Get, Ip, Param, ParseIntPipe, Post, Query,
} from '@nestjs/common';
import { CreateStreamVoteDto } from '@truepoint/shared/dist/dto/broadcast-info/CreateStreamVote.dto';
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

  @Post('vote')
  vote(@Ip() ip: string, @Body(ValidationPipe) dto: CreateStreamVoteDto): Promise<number> {
    return this.broadcastService.vote({ ...dto, ip });
  }

  @Delete('vote')
  cancelVote(@Query('id') id: number): Promise<number> {
    return this.broadcastService.cancelVote(id);
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
   * 관리자페이지 이용자정보 조회탭에서 사용
   * userId를 받아 해당 유저의 전체 방송 목록 조회
   * @param userId 방송목록 조회할 유저의 userId
   */
  @Get('byuser/:userId')
  getStreamsByUserId(@Param('userId') userId: string): Promise<BroadcastDataForDownload[]> {
    return this.broadcastService.getStreamsByUserId(userId);
  }

  /**
   * 
   * @param platform twitch | afreeca
   * @param streamId 
   * @returns 
   */
  @Get(':platform/:streamId')
  async findOneStream(
    @Ip() ip: string,
    @Param(ValidationPipe) params: FindOneStreamDto,
  ): Promise<RecentStream> {
    const { platform, streamId } = params;
    const streamData = await this.broadcastService.findOneSteam(platform, streamId);
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
