import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';

// aws
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
// logic class
import moment from 'moment';
import { UserStatisticInfo } from './class/userStatisticInfo.class';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
// dto
import { TestRequest } from './dto/TestRequest.dto';
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
// date library
// aws s3
dotenv.config();
const s3 = new AWS.S3();
interface TimeLine{
  smile_count: number;
  chat_count: number;
}
interface S3StreamData {
  start_date: string;
  end_date: string;
  time_line: TimeLine[];
}
@Injectable()
export class StreamAnalysisService {
  constructor(
    @InjectRepository(StreamsEntity)
      private readonly streamsRepository: Repository<StreamsEntity>,
    @InjectRepository(StreamSummaryEntity)
      private readonly streamSummaryRepository: Repository<StreamSummaryEntity>,
  ) {}

  /** **************************************************** */
  async getMetricData(path): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: path
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getStreamList(testRequest:TestRequest[]): Promise<string[]> {
    const keyArray = [];
    const dataArray:S3StreamData[] = [];

    const keyFunc = (stream: any) => new Promise((resolve, reject) => {
      const datePath = moment(stream.startedAt).format('YYYY-MM-DD').split('-');
      const path = `metrics_json/${stream.creatorId}/${datePath[0]}/${datePath[1]}/${datePath[2]}/${stream.streamId}`;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Delimiter: '',
        Prefix: path,
      };

      s3.listObjects(params).promise()
        .then((values) => {
          if (values.Contents) {
            values.Contents.map((value) => {
              if (value.Key) keyArray.push(value.Key);
              resolve();
            });
          }
        });
    });

    const dataFunc = (key: any) => new Promise((resolve, reject) => {
      const param = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: key
      };

      const streamData = s3.getObject(param).promise()
        .then((data) => {
          const JsonData: S3StreamData = JSON.parse(data.Body.toString('utf-8'));
          dataArray.push({
            start_date: JsonData.start_date,
            end_date: JsonData.end_date,
            time_line: JsonData.time_line,
          });
          resolve();
        });

      return streamData;
    });

    const calculateData = () => new Promise((resolve, reject) => {
      const ASCdataArray = dataArray.sort((obj1, obj2) => {
        if (moment(obj1.start_date) > moment(obj2.start_date)) return 1;
        if (moment(obj1.start_date) < moment(obj2.start_date)) return -1;
        return 0;
      });

      for (let i = 0; i < ASCdataArray.length - 1; i += 1) {
        const currStream = ASCdataArray[i];
        const nextStream = ASCdataArray[i + 1];

        if (currStream.end_date > nextStream.start_date) {
          // crossRangeFunc

           
        }
      }
    });

    const getAllKeys = (list: any[]) => Promise.all(list.map((stream) => keyFunc(stream)));
    const getAllDatas = (list: any[]) => Promise.all(list.map((stream) => dataFunc(stream)));

    getAllKeys(testRequest).then(() => {
      console.log('Step1 Clear');
      console.log('key array : ', keyArray);

      getAllDatas(keyArray)
        .then(() => {
          console.log('Step2 Clear');

          calculateData()
            .then((i) => console.log(i));
        });
    });

    return [];
  }

  /** **************************************************** */

  /*
    input   :  userId, date
    output  :  date 의 month 에 해당하는 [ {streamId, platform, title, startAt, airTime,creatorId}, ... ]
  */
  async findDayStreamList(
    userId: string,
    startDate: string, endDate?: string
  ): Promise<DayStreamsInfo[]> {
    if (!endDate) {
      // 2020-09-20 -> 2020-09-01 00:00 ~ 2020-09-30 23:59
      const originDate = new Date(startDate);
      const startAt = new Date(originDate.getFullYear(), originDate.getMonth(), 1, 24);
      const endAt = new Date(originDate.getFullYear(), originDate.getMonth() + 1, 1, 24);
      const DayStreamData = await this.streamsRepository
        .createQueryBuilder('streams')
        .select(['streamId', 'platform', 'title', 'startedAt', 'airTime',])
        .where('streams.userId = :id', { id: userId })
        .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
        .andWhere('streams.startedAt < :endDate', { endDate: endAt })
        .execute();

      return DayStreamData;
    }
    const startAt = new Date(startDate);
    const endAt = new Date(endDate);
    const TermStreamsData = await this.streamsRepository
      .createQueryBuilder('streams')
      .select(['streamId', 'platform', 'title', 'startedAt', 'airTime', 'creatorId'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startedAt < :endDate', { endDate: endAt })
      .orderBy('startedAt', 'ASC')
      .execute();

    return TermStreamsData;
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

// async findStreamInfoByTerm(userId: string, startAt: string, endAt: string)
//   : Promise<StreamsInfo[]> {
//     const streamsTermData: any[] = await this.streamSummaryRepository
//       .createQueryBuilder('streamSummary')
//       .innerJoin(
//         StreamsEntity,
//         'streams',
//         'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
//       )
//       .select(['streamSummary.*', 'viewer', 'chatCount'])
//       .where('streams.userId = :id', { id: userId })
//       .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
//       .andWhere('streams.startedAt <= :endDate', { endDate: endAt })
//       .execute()
//       .catch((err) => {
//         throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
//       });

//     return streamsTermData;
//   }
