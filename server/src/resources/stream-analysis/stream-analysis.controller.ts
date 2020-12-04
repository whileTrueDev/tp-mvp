import {
  Controller, Get, ParseArrayPipe,
  Query, UseGuards, Inject,
  Post, Body,
} from '@nestjs/common';
// shared dto , interfaces
import { SearchEachS3StreamData } from '@truepoint/shared/dist/dto/stream-analysis/searchS3StreamData.dto';
import { SearchEachStream } from '@truepoint/shared/dist/dto/stream-analysis/searchEachStreamData.dto';
import { SearchCalendarStreams } from '@truepoint/shared/dist/dto/stream-analysis/searchCalendarStreams.dto';
import { SearchStreamInfoByStreamId } from '@truepoint/shared/dist/dto/stream-analysis/searchStreamInfoByStreamId.dto';
import { EachStream } from '@truepoint/shared/dist/dto/stream-analysis/eachStream.dto';
import { SearchUserStatisticData } from '@truepoint/shared/dist/dto/stream-analysis/searchUserStatisticData.dto';
import { PeriodsAnalysisResType } from '@truepoint/shared/dist/res/PeriodsAnalysisResType.interface';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import { StreamAnalysisResType } from '@truepoint/shared/dist/res/StreamAnalysisResType.interface';
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';

// Services
import { UsersService } from '../users/users.service';
import { StreamAnalysisService } from './stream-analysis.service';
// // pipe
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

  /**
  * 캘린더 방송 정보 표시
  * @param findDaysStreamRequest endDate 가 존재시 기간에 해당하는 정보를 , 이외 startDate 가 속한 달에 대한 정보 조회
  */
  @Get('stream-list-before')
  @UseGuards(JwtAuthGuard)
  getDaysStreamList(@Query(new ValidationPipe())
    findDaysStreamRequest: SearchCalendarStreams): Promise<StreamDataType[]> {
    return this.streamAnalysisService.findDayStreamList(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  /**
  * 캘린더 포함하여 분석 완료된 방송 정보 리스트 조회
  * @param findDaysStreamRequest endDate 가 존재시 기간에 해당하는 정보를 , 이외 startDate 가 속한 달에 대한 정보 조회
  */
 @Get('stream-list')
 @UseGuards(JwtAuthGuard)
  getCompleteStreamsList(@Query(new ValidationPipe())
    findDaysStreamRequest: SearchCalendarStreams): Promise<StreamDataType[]> {
    return this.streamAnalysisService.findDayStreamList2(
      findDaysStreamRequest.userId,
      findDaysStreamRequest.startDate,
      findDaysStreamRequest.endDate,
    );
  }

  /**
  * 방송 대 방송 분석
  * @param findInfoRequest 2개의 방송을 배열 형태로 받는다.
  */
  @Get('streams')
  @UseGuards(JwtAuthGuard)
 getStreamsInfo(
    @Query('streams', new ParseArrayPipe({ items: SearchEachStream })) findInfoRequest: SearchStreamInfoByStreamId,
 ): Promise<StreamAnalysisResType[]> {
   return this.streamAnalysisService.SearchStreamInfoByStreamId(findInfoRequest);
 }

  /**
   * 기간 대 기간 분석
   * @param base 분석 가능 방송 리스트 
   * @param compare 분석 가능 방송 리스트
   */
  @Post('periods')
  @UseGuards(JwtAuthGuard)
  async getPeriodsStreamsInfo(
  @Body('base', new ParseArrayPipe({ items: EachStream })) base: EachStream[],
  @Body('compare', new ParseArrayPipe({ items: EachStream })) compare: EachStream[],
  ): Promise<PeriodsAnalysisResType> {
    const result = await this.streamAnalysisService.findStreamInfoByPeriods([base, compare]);
    console.log(result.timeline);
    return result;
  }

  /**
  * 기간 추이 분석
  * @param s3Request S3 조회 규격 방송 리스트
  */
  @Get('period')
  @UseGuards(JwtAuthGuard)
  getTest(
    @Query('streams', new ParseArrayPipe({ items: SearchEachS3StreamData }))
      s3Request: SearchEachS3StreamData[],
  ): Promise<PeriodAnalysisResType> {
    return this.streamAnalysisService.findStreamInfoByPeriod(s3Request);
  }

  /**
  * 대쉬보드 통계 정보
  * @param findUserStatisticRequest 유저 아이디 
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
