import {
  Controller, Get, ParseArrayPipe, Query, UseGuards, Body
} from '@nestjs/common';
import { StreamAnalysisService } from './stream-analysis.service';
// pipe
import { ValidationPipe } from '../../pipes/validation.pipe';
// guard
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { UserStatisticInfo } from './interface/userStatisticInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
// dto
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
import { FindUserStatisticInfo } from './dto/findUserStatisticInfo.dto';
import { EachStream } from './dto/eachStream.dto';
import { FindStreamInfoByTerms } from './dto/findStreamInfoByTerms.dto';
import { FindAllStreams } from './dto/findAllStreams.dto';
import { TestRequest } from './dto/TestRequest.dto';
@Controller('stream-analysis')
export class StreamAnalysisController {
  constructor(private readonly streamAnalysisService: StreamAnalysisService) {}

  @Get('test')
  getTest(@Body() testRequest: TestRequest[]):Promise<any> {
    console.log(testRequest);
    return this.streamAnalysisService.getStreamList(testRequest);
  }

  @Get('stream-list')
  getDaysStreamList(@Query() findDaysStreamRequest: FindAllStreams): Promise<DayStreamsInfo[]> {
    return this.streamAnalysisService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate
    );
  }

  /*
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
  ): Promise<StreamsInfo[]> {
    return this.streamAnalysisService.findStreamInfoByStreamId(findInfoRequest);
  }

  /*
    input   :  params: {
                startAt: (new Date(0)).toISOString(),
                endAt: (new Date()).toISOString(),
                userId: 'userId1'
              }
    output  :  { chat_count , smile_count , viewer }
  */
  @Get('terms')
  @UseGuards(JwtAuthGuard)
  getTermStreamsInfo(
    @Query(new ValidationPipe()) findTermRequest: FindStreamInfoByTerms
  )
  : Promise<StreamsInfo[]> {
    return this.streamAnalysisService.findStreamInfoByTerm(
      findTermRequest.userId,
      findTermRequest.startAt,
      findTermRequest.endAt
    );
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
}
