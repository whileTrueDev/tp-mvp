import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import { findStreamInfoByStreamId as Stream } from './dto/findStreamInfoByStreamId.dto';
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
  async findStreamInfoByStreamId(stream1: Stream, stream2: Stream): Promise<StreamSummaryEntity[]> {
    // streamId 를 통해 각 stream 의 정보를 조회한다.

    const streamInfo1 = await this.streamSummaryRepository
      .createQueryBuilder()
      .where('streamId = :id', { id: stream1.streamId })
      .andWhere('platform = :platform', { platform: stream1.platform })
      .getOne()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'findStreamInfoByStreamId Error');
      });

    const streamInfo2 = await this.streamSummaryRepository
      .createQueryBuilder()
      .where('streamId = :id', { id: stream2.streamId })
      .andWhere('platform = :platform', { platform: stream2.platform })
      .getOne()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'findStreamInfoByStreamId Error');
      });

    return [streamInfo1, streamInfo2];
  }

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */

  async findStreamInfoByTerm(userId: string, startAt: Date, endAt: Date)
  : Promise<StreamSummaryEntity[]> {
    const streamsTermData: StreamSummaryEntity[] = await this.streamSummaryRepository
      .createQueryBuilder('streamSummary')
      .innerJoin(
        StreamsEntity,
        'streams',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
      )
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startAt <= :endDate', { endDate: endAt })
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'Stream Term Anlaysis Error');
      });

    return streamsTermData;
  }
}
