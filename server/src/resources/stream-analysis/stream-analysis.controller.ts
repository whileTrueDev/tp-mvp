import {
  Controller, Get, ParseArrayPipe, Query, UseGuards, Inject,
} from '@nestjs/common';
// shared dto , interfaces
import { EachS3StreamInfo as EachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/eachS3StreamInfo.dto';
import { SearchEachStream } from '@truepoint/shared/dist/dto/stream-analysis/searchEachStreamData.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { SearchStreamInfoByPeriods } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByPeriods.dto';
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';

import { SearchUserStatisticData } from '@truepoint/shared/dist/dto/stream-analysis/searchUserStatisticData.dto';

import { PeriodsAnalysisResType } from '@truepoint/shared/dist/res/PeriodsAnalysisResType.interface';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import { StreamAnalysisResType } from '@truepoint/shared/dist/res/StreamAnalysisResType.interface';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
// services
// Services
import { UsersService } from '../users/users.service';
import { StreamAnalysisService } from './stream-analysis.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';
// guard
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// Entity
import { StreamsEntity } from './entities/streams.entity';
@Controller('stream-analysis')
export class StreamAnalysisController {
  constructor(
    private readonly streamAnalysisService: StreamAnalysisService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  /*
    캘린더 방송 날짜 표시
    input   :  { startDate, endDate, targetUserId? , userId }
    output  :  { chat_count , smile_count , viewer }
  */
  @Get('stream-list')
  @UseGuards(JwtAuthGuard)
  getDaysStreamList(@Query() findDaysStreamRequest: SearchCalendarStreams): Promise<DayStreamsInfo[]> {
    return this.streamAnalysisService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  /*
    방송 대 방송 분석
    input   :  params: {
                  streams: 
                    [ { streamId: 'streamId1', platform: 'twitch' }, 
                      { streamId: 'streamId2', platform: 'twitch' }] 
                } 
  */
  @Get('streams')
  @UseGuards(JwtAuthGuard)
  getStreamsInfo(
    @Query('streams', new ParseArrayPipe({ items: SearchEachStream })) findInfoRequest: SearchStreamInfoByStreamId,
  ): Promise<StreamAnalysisResType[]> {
    return this.streamAnalysisService.SearchStreamInfoByStreamId(findInfoRequest);
  }

  /*
    기간 대 기간 분석
    input   :  { userId, baseStartAt, baseEndAt, compareStartAt, compareEndAt }
  */
  @Get('periods')
  @UseGuards(JwtAuthGuard)
  getPeriodsStreamsInfo(
    @Query(new ValidationPipe()) findTermRequest: SearchStreamInfoByPeriods,
  ): Promise<PeriodsAnalysisResType> {
    return this.streamAnalysisService.findStreamInfoByPeriods(
      findTermRequest.userId,
      [
        { startAt: findTermRequest.baseStartAt, endAt: findTermRequest.baseEndAt },
        { startAt: findTermRequest.compareStartAt, endAt: findTermRequest.compareEndAt },
      ],
    );
  }

  /*
    기간 추이 분석
    input   : streams : [{creatorId, streamId, startedAt}, {creatorId, streamId, startedAt}, ...]
  */
  @Get('period')
  @UseGuards(JwtAuthGuard)
  getTest(
    @Query('streams', new ParseArrayPipe({ items: EachS3StreamData }))
      s3Request: EachS3StreamData[],
  ): Promise<PeriodAnalysisResType> {
    return this.streamAnalysisService.findStreamInfoByPeriod(s3Request);
  }

  /*
    jwt guard -> 권한 검사 , 구독 확인
    input   :   params: {
                  nowDate: (new Date()).toISOString(),
                  userId: 'userId1'
                }
    output  :  { allPlatformData: { avgViewer, avgLength, changeFan, totalChatCount , count }, 
                 afreecaData : // , twitchData : // , youtubeData : // }
  */
  @Get('user-statistics')
  @UseGuards(JwtAuthGuard)
  getUserStatisticsInfo(
    @Query() findUserStatisticRequest: SearchUserStatisticData,
  ): Promise<StreamsEntity[]> {
    return this.streamAnalysisService.findUserWeekStreamInfoByUserId(
      findUserStatisticRequest.userId,
    );
  }
}
