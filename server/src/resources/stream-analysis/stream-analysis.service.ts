import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import { findStreamInfoByStreamId as Streams } from './dto/findStreamInfoByStreamId.dto';
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
  async findStreamInfoByStreamId(streams: Streams)
  : Promise<StreamSummaryEntity[]> {
    console.log(streams);
    const streamInfoBase = await this.streamSummaryRepository
      .createQueryBuilder()
      .where('streamId = :id', { id: streams[0].streamId })
      .andWhere('platform = :platform', { platform: streams[0].platform })
      .getOne()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    if (streams[1]) {
      const streamInfoCompare = await this.streamSummaryRepository
        .createQueryBuilder()
        .where('streamId = :id', { id: streams[1].streamId })
        .andWhere('platform = :platform', { platform: streams[1].platform })
        .getOne()
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
        });
      return [streamInfoBase, streamInfoCompare];
    }

    return [streamInfoBase, null];
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
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    return streamsTermData;
  }
}
