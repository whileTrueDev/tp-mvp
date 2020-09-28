import {
  Controller, Get, ParseArrayPipe, Query, UseGuards, Inject
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StreamAnalysisService } from './stream-analysis.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';
// guard
// import { SubscribeGuard } from '../../guards/subscribe.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { UserStatisticInfo } from './interface/userStatisticInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
// dto
import { Category } from './dto/category.dto';
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
import { FindUserStatisticInfo } from './dto/findUserStatisticInfo.dto';
import { EachStream } from './dto/eachStream.dto';
import { FindStreamInfoByTerms } from './dto/findStreamInfoByTerms.dto';
import { FindAllStreams } from './dto/findAllStreams.dto';
import { FindS3StreamInfo } from './dto/findS3StreamInfo.dto';
@Controller('stream-analysis')
export class StreamAnalysisController {
  constructor(
    private readonly streamAnalysisService: StreamAnalysisService,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  /*
    캘린더 방송 날짜 표시
    input   :  { startDate, endDate, targetUserId? , userId }
    output  :  { chat_count , smile_count , viewer }
  */
  @Get('stream-list')
  getDaysStreamList(@Query() findDaysStreamRequest: FindAllStreams): Promise<DayStreamsInfo[]> {
    return this.streamAnalysisService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate
    );
  }

  /*
    방송 대 방송 분석
    input   :  params: {
                  streams: 
                    [ { streamId: 'streamId1', platform: 'twitch' }, 
                      { streamId: 'streamId2', platform: 'twitch' }] 
                } 
    output  :  [{ chat_count , smile_count , viewer } || null ,
                { chat_count , smile_count , viewer } || null ]
  */
  @Get('streams')
  @UseGuards(JwtAuthGuard)
  getStreamsInfo(
    @Query('streams', new ParseArrayPipe({ items: EachStream })) findInfoRequest: FindStreamInfoByStreamId
  ): Promise<any> {
    return this.streamAnalysisService.findStreamInfoByStreamId(findInfoRequest);
  }

  /*
    기간 대 기간 분석
    input   :  
    output  :  { chat_count , smile_count , viewer }
  */

  @Get('periods')
  getPeriodsStreamsInfo(
  @Query(new ValidationPipe()) findTermRequest: FindStreamInfoByTerms
  )
  : Promise<StreamsInfo[]> {
    return this.streamAnalysisService.findStreamInfoByPeriods(
      findTermRequest.userId,
      [
        { startAt: findTermRequest.baseStartAt, endAt: findTermRequest.baseEndAt },
        { startAt: findTermRequest.compareStartAt, endAt: findTermRequest.compareEndAt },
      ]
    );
  }

  /*
    기간 추이 분석
    input   : [{creatorId, streamId, startedAt}, {creatorId, streamId, startedAt}, ...]
    output  : [
      {time_line, total_index, start_date, end_date}, 
      {time_line, total_index, start_date, end_date}, ... 
    ]
  */
 @Get('streams-term-info')
  getTest(
    @Query('category') category: Category,
    @Query('streams', new ParseArrayPipe({ items: FindS3StreamInfo }))
      s3Request: FindS3StreamInfo[]
  ):Promise<any> {
    return this.streamAnalysisService.getStreamList(category, s3Request);
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
    @Query(new ValidationPipe()) findUserStatisticRequest: FindUserStatisticInfo
 )
  : Promise<UserStatisticInfo> {
   return this.streamAnalysisService.findUserWeekStreamInfoByUserId(
     findUserStatisticRequest.userId,
     findUserStatisticRequest.nowDate
   );
 }

  @Get('test')
  getData() :Promise<any> {
    return this.streamAnalysisService.getData();
  }
}
