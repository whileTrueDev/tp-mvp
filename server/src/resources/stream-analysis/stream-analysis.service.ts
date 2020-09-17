import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';

// logic class
import { start } from 'repl';
import { UserStatisticInfo } from './class/userStatisticInfo.class';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
// dto
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
// database entities
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
    input   :  userId, date
    output  :  date 의 month 에 해당하는 [ {streamId, platform, title, startAt, airTime}, ... ]
  */
  async findDayStreamList(userId: string, date: string): Promise<DayStreamsInfo[]> {
    // 2020-09-20 -> 2020-09-01 00:00 ~ 2020-09-30 23:59
    const originDate = new Date(date);
    const startAt = new Date(originDate.getFullYear(), originDate.getMonth(), 1, 24);
    const endAt = new Date(originDate.getFullYear(), originDate.getMonth() + 1, 1, 24);
    // console.log(originDate);

    const DayStreamData = await this.streamsRepository
      .createQueryBuilder('streams')
      .select(['streamId', 'platform', 'title', 'startedAt', 'airTime'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startedAt < :endDate', { endDate: endAt })
      .execute();

    console.log(DayStreamData.length);
    return DayStreamData;
  }

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
  async findUserWeekStreamInfoByUserId(userId: string, nowDate: string): Promise<any> {
    // ISO Date String --> 요일 기준 YYYY-MM-DD 00:00:00:000 변환
    const nowAt = new Date(nowDate);
    const startAt = new Date(nowAt);
    startAt.setDate(startAt.getDate() - 7);
    nowAt.setHours(0, 0, 0, 0);
    startAt.setHours(0, 0, 0, 0);

    /*
      streamsInfoArray
      viewer    :  기간내 방송 당 시청자 수  평균
      fan       :  nowDate 와 가장 가까운 방송 의 fan
      length    :  기간내 방송 당 방송 시간 평균 
      chatCount :  기간내 총 채팅 발생 수 -> 단순 합산
    */
    const streamsInfoArray: StreamsEntity[] = await this.streamsRepository
      .createQueryBuilder('streams')
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt > :startDate', { startDate: startAt.toISOString() })
      .andWhere('streams.startedAt < :nowDate', { nowDate: nowAt.toISOString() })
      .getMany()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    const twitchData = new UserStatisticInfo();
    const afreecaData = new UserStatisticInfo();
    const youtubeData = new UserStatisticInfo();
    const allPlatformData = new UserStatisticInfo();

    streamsInfoArray.forEach((data) => {
      allPlatformData.pushData(data);
      switch (data.platform) {
        case 'twitch': {
          twitchData.pushData(data);
          break;
        }
        case 'afreeca': {
          afreecaData.pushData(data);
          break;
        }
        case 'youtube': {
          youtubeData.pushData(data);
          break;
        }
        default: {
          // data 오류
          throw new HttpException(
            'Invalid Array Data Format ... ',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    });

    // streamInfoArray legnth 0 일 경우 initial value return
    allPlatformData.calculateData();
    twitchData.calculateData();
    afreecaData.calculateData();
    youtubeData.calculateData();

    return {
      allPlatformData,
      twitchData,
      afreecaData,
      youtubeData
    };
  }
}
