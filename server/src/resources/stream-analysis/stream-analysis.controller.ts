import {
  Controller, Body, Get, Query, Param
} from '@nestjs/common';
import { query } from 'express';
import { StreamAnalysisService } from './stream-analysis.service';
import { StreamInfo } from './interface/streamInfo.interface';
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';

interface test{
  streamId : string;
  platform : string;
}

@Controller('stream-analysis')
export class StreamAnalysisController {
  constructor(private readonly streamAnalysisService: StreamAnalysisService) {}
  /*
    input   :  stream1 : { streamId , platform } , 
               stream2 : { streamId , platform } 
    output  :  stream1 : { chat_count , smile_count , viewer or subscribe_count } ,
               stream2 : { chat_count , smile_count , viewer or subscribe_count } 
  */

  @Get('streams')
  getStreamsInfo(@Body() body): Promise<StreamInfo[]> {
    const {
      streamId1, platform1, streamId2, platform2
    } = body;
    const stream1 = {
      streamId: streamId1,
      platform: platform1,
    };
    const stream2 = {
      streamId: streamId2,
      platform: platform2,
    };

    return this.streamAnalysisService.findStreamInfoByStreamId(stream1, stream2);
  }

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  @Get('term')
  getTermStreamsInfo(@Body() body): Promise<StreamsEntity[]|StreamSummaryEntity[]> {
    return this.streamAnalysisService.findStreamInfoByTerm(body.userId, body.startAt, body.endAt);
  }
}
