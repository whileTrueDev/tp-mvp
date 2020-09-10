import {
  Controller, Body, Get, ValidationPipe as ArrayValidationPipe, ParseArrayPipe
} from '@nestjs/common';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { findStreamInfoByTerms } from './dto/findStreamInfoByTerms.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { findStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
import { findUserStatisticInfo } from './dto/findUserStatisticInfo.dto';
@Controller('stream-analysis')
export class StreamAnalysisController {
  constructor(private readonly streamAnalysisService: StreamAnalysisService) {}
  /*
    input   :  {  stream1 : { streamId , platform } , 
                  stream2 : { streamId , platform }  }
    output  :  stream1 : { chat_count , smile_count , viewer or subscribe_count } ,
               stream2 : { chat_count , smile_count , viewer or subscribe_count } 
  */
  @Get('streams')
  getStreamsInfo(
    @Body('streams') findInfoRequest: findStreamInfoByStreamId
  )
    : Promise<StreamSummaryEntity[]> {
    return this.streamAnalysisService.findStreamInfoByStreamId(findInfoRequest);
  }

  /*
    input   :  { startAt(ISODateString) , endAt(ISODateString) , userId }
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  @Get('term')
  getTermStreamsInfo(@Body(new ValidationPipe()) body: findStreamInfoByTerms)
  : Promise<StreamSummaryEntity[]> {
    return this.streamAnalysisService
      .findStreamInfoByTerm(body.userId, body.startAt, body.endAt);
    // as Date 차후 프론트 데이터 포멧 확인후 수정
  }

  /*
    input   :  { userId , nowDate(ISODateString) }
    output  :  7 days streams[] 
  */
  @Get('user-statistics')
  getUserStatisticsInfo(@Body(new ValidationPipe()) body: findUserStatisticInfo)
  : any {
    return this.streamAnalysisService.findUserWeekStreamInfoByUserId(body.userId, body.nowDate.split('T')[0]);
  }
}
