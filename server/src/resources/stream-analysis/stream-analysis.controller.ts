import {
  Controller, Body, Get,
} from '@nestjs/common';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { findStreamInfoByTerms } from './dto/findStreamInfoByTerms.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { findStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';

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
    @Body('stream1', new ValidationPipe()) stream1:findStreamInfoByStreamId,
    @Body('stream2', new ValidationPipe()) stream2:findStreamInfoByStreamId
  )
    : Promise<StreamSummaryEntity[]> {
    return this.streamAnalysisService.findStreamInfoByStreamId(stream1, stream2);
  }

  /*
    input   :  { startAt , endAt , userId }
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  @Get('term')
  getTermStreamsInfo(@Body(new ValidationPipe()) body: findStreamInfoByTerms)
    : Promise<StreamSummaryEntity[]> {
    return this.streamAnalysisService
      .findStreamInfoByTerm(body.userId, body.startAt as Date, body.endAt as Date);
    // as Date 차후 프론트 데이터 포멧 확인후 수정
  }
}
