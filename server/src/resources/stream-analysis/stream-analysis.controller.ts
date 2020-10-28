import {
  Controller, Get, ParseArrayPipe, Query, UseGuards, Inject,
} from '@nestjs/common';
// DTOs
import { FindStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/findStreamInfoByStreamId.dto';
import { FindUserStatisticInfo } from '@truepoint/shared/dist/dto/stream-analysis/findUserStatisticInfo.dto';
import { EachStream } from '@truepoint/shared/dist/dto/stream-analysis/eachStream.dto';
import { FindStreamInfoByTerms } from '@truepoint/shared/dist/dto/stream-analysis/findStreamInfoByTerms.dto';
import { FindAllStreams } from '@truepoint/shared/dist/dto/stream-analysis/findAllStreams.dto';
import { FindS3StreamInfo } from '@truepoint/shared/dist/dto/stream-analysis/findS3StreamInfo.dto';
// Services
import { UsersService } from '../users/users.service';
import { StreamAnalysisService } from './stream-analysis.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';
// guard
// import { SubscribeGuard } from '../../guards/subscribe.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// interface
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
import { PeriodAnalysis } from './interface/periodAnalysis.interface';
import { PeriodsAnalysis } from './interface/periodsAnalysis.interface';
import { StreamAnalysis } from './interface/streamAnalysis.interface';
// entity
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
  getDaysStreamList(@Query() findDaysStreamRequest: FindAllStreams): Promise<DayStreamsInfo[]> {
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
    @Query('streams', new ParseArrayPipe({ items: EachStream })) findInfoRequest: FindStreamInfoByStreamId,
  ): Promise<(StreamAnalysis | null)[]> {
    return this.streamAnalysisService.findStreamInfoByStreamId(findInfoRequest);
  }

  /*
    기간 대 기간 분석
    input   :  { userId, baseStartAt, baseEndAt, compareStartAt, compareEndAt }
  */
  @Get('periods')
  @UseGuards(JwtAuthGuard)
  getPeriodsStreamsInfo(
    @Query(new ValidationPipe()) findTermRequest: FindStreamInfoByTerms,
  ): Promise<PeriodsAnalysis> {
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
    @Query('streams', new ParseArrayPipe({ items: FindS3StreamInfo }))
      s3Request: FindS3StreamInfo[],
  ): Promise<PeriodAnalysis> {
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
    @Query() findUserStatisticRequest: FindUserStatisticInfo,
  ): Promise<StreamsEntity[]> {
    return this.streamAnalysisService.findUserWeekStreamInfoByUserId(
      findUserStatisticRequest.userId,
    );
  }
}
