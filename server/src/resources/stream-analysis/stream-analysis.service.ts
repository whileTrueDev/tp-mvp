import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import { start } from 'repl';
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
      .createQueryBuilder('streamSummary')
      .innerJoin(
        StreamsEntity,
        'streams',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
      )
      .select(['streamSummary.*', 'viewer'])
      .where('streamSummary.streamId = :id', { id: streams[0].streamId })
      .andWhere('streamSummary.platform = :platform', { platform: streams[0].platform })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    if (streams[1]) {
      const streamInfoCompare = await this.streamSummaryRepository
        .createQueryBuilder('streamSummary')
        .innerJoin(
          StreamsEntity,
          'streams',
          'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
        )
        .select(['streamSummary.*', 'viewer'])
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

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  async findStreamInfoByTerm(userId: string, startAt: Date, endAt: Date)
  : Promise<StreamSummaryEntity[]> {
    console.log(userId, startAt, endAt);
    const streamsTermData: any[] = await this.streamSummaryRepository
      .createQueryBuilder('streamSummary')
      .innerJoin(
        StreamsEntity,
        'streams',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
      )
      .select(['streamSummary.*', 'viewer'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startAt <= :endDate', { endDate: endAt })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    return streamsTermData;
  }

  async findUserWeekStreamInfoByUserId(userId: string, nowDate: string): Promise<any> {
    const nowAt = new Date(nowDate);
    const startAt = new Date(nowAt);
    startAt.setDate(startAt.getDate() - 7);

    console.log('now : ', nowAt.toISOString());
    console.log('start : ', startAt.toISOString());

    const streamsInfoArray: any[] = await this.streamSummaryRepository
      .createQueryBuilder('streamSummary')
      .innerJoin(StreamsEntity, 'streams', 'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform')
      .select(['streamSummary.*'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startAt > :startDate', { startDate: startAt.toISOString() })
      .andWhere('streams.startAt <= :nowDate', { nowDate: nowAt.toISOString() })
      .execute();

    return streamsInfoArray;
  }

  async test(userId: string, nowDate: string): Promise<any> {
    const nowAt = new Date(nowDate);
    const startAt = new Date(nowAt);
    startAt.setDate(startAt.getDate() - 7);

    console.log('now : ', nowAt.toISOString());
    console.log('start : ', startAt.toISOString());

    const streamsInfoArray: any[] = await this.streamsRepository
      .createQueryBuilder('streams')
      .innerJoin(StreamSummaryEntity, 'streamSummary', 'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform')
      .select(['streams.* , streamSummary.chatCount'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startAt > :startDate', { startDate: startAt.toISOString() })
      .andWhere('streams.startAt <= :nowDate', { nowDate: nowAt.toISOString() })
      .execute();

    console.log(streamsInfoArray);

    /*
      streamsInfoArray
      viewer    :  기간내 방송 당 시청자 수  평균
      fan       :  nowDate - 7d 와 가장 가까운 방송 당시의 fan 과 nowDate 와 가장 가까운 방송 당시의 fan 차이
      length    :  기간내 방송 당 방송 시간 평균 
      chatCount :  기간내 총 채팅 발생 수 -> 단순 합산
    */

    const twitchData = {
      avgViewer: 0.0,
      avgLength: 0.0,
      totalChatCount: 0.0,
      changeFan: 0.0
    };
    const afreecaData = {
      avgViewer: 0.0,
      avgLength: 0.0,
      totalChatCount: 0.0,
      changeFan: 0.0
    };
    const youtubeData = {
      avgViewer: 0.0,
      avgLength: 0.0,
      totalChatCount: 0.0,
      changeFan: 0.0
    };
    const allPlatformData = {
      avgViewer: 0.0,
      avgLength: 0.0,
      totalChatCount: 0.0,
      changeFan: 0.0

    };

    streamsInfoArray.forEach((data) => {
      allPlatformData.totalChatCount += data.chatCount;
      allPlatformData.avgLength += data.length;
      allPlatformData.avgViewer += data.viewer;

      switch (data.platform) {
        case 'twitch': {
          twitchData.totalChatCount += data.chatCount;
          twitchData.avgLength += data.length;
          twitchData.avgViewer += data.viewer;
          break;
        }
        case 'afreeca': {
          afreecaData.totalChatCount += data.chatCount;
          afreecaData.avgLength += data.length;
          afreecaData.avgViewer += data.viewer;
          break;
        }
        case 'youtube': {
          youtubeData.totalChatCount += data.chatCount;
          youtubeData.avgLength += data.length;
          youtubeData.avgViewer += data.viewer;
          break;
        }
        default: {
          // data 오류
          throw new HttpException('Request Notification Index is Invalid ... ', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    });

    allPlatformData.changeFan = streamsInfoArray[streamsInfoArray.length - 1].fan - streamsInfoArray[0].fan;
    allPlatformData.avgLength /= streamsInfoArray.length;
    allPlatformData.avgViewer /= streamsInfoArray.length;

    // twitchData.changeFan = streamsInfoArray[streamsInfoArray.length - 1].fan - streamsInfoArray[0].fan;
    // twitchData.avgLength /= streamsInfoArray.length;
    // twitchData.avgViewer /= streamsInfoArray.length;

    // afreecaData.changeFan = streamsInfoArray[streamsInfoArray.length - 1].fan - streamsInfoArray[0].fan;
    // afreecaData.avgLength /= streamsInfoArray.length;
    // afreecaData.avgViewer /= streamsInfoArray.length;

    // youtubeData.changeFan = streamsInfoArray[streamsInfoArray.length - 1].fan - streamsInfoArray[0].fan;
    // youtubeData.avgLength /= streamsInfoArray.length;
    // youtubeData.avgViewer /= streamsInfoArray.length;

    return {
      allPlatformData, twitchData, afreecaData, youtubeData
    };
  }
}
