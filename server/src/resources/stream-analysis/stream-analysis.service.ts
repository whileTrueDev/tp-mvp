import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository, Equal, MoreThan, LessThan, Between
} from 'typeorm';
import { format } from 'date-fns';
import { start } from 'repl';
import { findStreamInfoByStreamId as Stream } from './dto/findStreamInfoByStreamId.dto';
import { StreamInfo } from './interface/streamInfo.interface';
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';

@Injectable()
export class StreamAnalysisService {
  constructor(
    @InjectRepository(StreamsEntity)
      private readonly streamsRepository: Repository<StreamsEntity>,
    @InjectRepository(StreamSummaryEntity)
      private readonly streamSummaryRepository: Repository<StreamSummaryEntity>,
  ) {}
  /*
    input   :  streamId , platform
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  async findStreamInfoByStreamId(stream1: Stream, stream2: Stream): Promise<StreamInfo[]> {
    // streamId 를 통해 각 stream 의 정보를 조회한다.

    const streamInfo1: StreamInfo = await this.streamSummaryRepository
      .createQueryBuilder()
      .where('streamId = :id', { id: stream1.streamId })
      .andWhere('platform = :platform', { platform: stream1.platform })
      .getOne();

    const streamInfo2: StreamInfo = await this.streamSummaryRepository
      .createQueryBuilder()
      .where('streamId = :id', { id: stream2.streamId })
      .andWhere('platform = :platform', { platform: stream2.platform })
      .getOne();

    return [streamInfo1, streamInfo2];
  }

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  async findStreamInfoByTerm(userId: string, startAt: Date, endAt: Date) {
    /*
      1.  Streams 에서 userId 와 startAt, endAt 을 사용하여 기간내 해당 유저의 모든 방송 streamId , platform 을 가져온다.
      2.  가져온 [{ streamId, platform }, ..] 을 사용하여 
          StreamSummary 에서 [{ chatCount, smileCount } ... ] 을 가져온다. 
    */
    // const streamInfos = await this.streamsRepository
    //   .createQueryBuilder('Streams')
    //   .select(['Streams.streamId', 'Streams.platform'])
    //   .where('userId = :id', { id: userId })
    //   .andWhere('startAt >= :startDate', { startDate: startAt })
    //   .andWhere('startAt <= :endDate', { endDate: endAt })
    //   .getMany();

    const streamInfos = await this.streamSummaryRepository
      .createQueryBuilder('streamSummary')
      .innerJoin(StreamsEntity,
        'streams', 'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform')
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startAt <= :endDate', { endDate: endAt })
      .select(['streamSummary.chatCount', 'streamSummary.smileCount'])
      .getMany();

    return streamInfos;
  }
}
