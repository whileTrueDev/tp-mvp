import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';

// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
// dto
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { UserStatisticInfo } from './interface/userStatisticInfo.interface';

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
    output  :  chat_count , smile_count , viewer
  */
  async findStreamInfoByStreamId(streams: FindStreamInfoByStreamId)
  : Promise<StreamsInfo[]> {
    if (streams[0]) {
      const streamInfoBase: StreamsInfo = await this.streamSummaryRepository
        .createQueryBuilder('streamSummary')
        .innerJoin(
          StreamsEntity,
          'streams',
          'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
        )
        .select(['streamSummary.*', 'viewer', 'chatCount'])
        .where('streamSummary.streamId = :id', { id: streams[0].streamId })
        .andWhere('streamSummary.platform = :platform', { platform: streams[0].platform })
        .execute()
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
        });

      if (streams[1]) {
        const streamInfoCompare: StreamsInfo = await this.streamSummaryRepository
          .createQueryBuilder('streamSummary')
          .innerJoin(
            StreamsEntity,
            'streams',
            'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
          )
          .select(['streamSummary.*', 'viewer', 'chatCount'])
          .where('streamSummary.streamId = :id', { id: streams[1].streamId })
          .andWhere('streamSummary.platform = :platform', { platform: streams[1].platform })
          .execute()
          .catch((err) => {
            throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
          });
        return [streamInfoBase, streamInfoCompare];
      }
      return [streamInfoBase, null];
    }
    return [null, null];
  }

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  async findStreamInfoByTerm(userId: string, startAt: string, endAt: string)
  : Promise<StreamsInfo[]> {
    const streamsTermData: any[] = await this.streamSummaryRepository
      .createQueryBuilder('streamSummary')
      .innerJoin(
        StreamsEntity,
        'streams',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
      )
      .select(['streamSummary.*', 'viewer', 'chatCount'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startedAt <= :endDate', { endDate: endAt })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    return streamsTermData;
  }

  /*
    input   :  userId, nowDate
    output  :  "airTime, viewer, fan" in Streams  +  "chat_count" in StreamSummary 
  */
  async findUserWeekStreamInfoByUserId(userId: string): Promise<StreamsEntity[]> {
    /*
      streamsInfoArray
      viewer    :  기간내 방송 당 시청자 수  평균
      fan       :  nowDate 와 가장 가까운 방송 의 fan
      length    :  기간내 방송 당 방송 시간 평균 
      chatCount :  기간내 총 채팅 발생 수 -> 단순 합산
    */
    const streams = await this.streamsRepository
      .createQueryBuilder('streams')
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt > DATE_SUB(NOW(), INTERVAL 14 DAY)')
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    return streams;
  }
}
