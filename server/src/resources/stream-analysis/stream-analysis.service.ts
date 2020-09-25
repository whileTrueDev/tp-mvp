import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus, Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';

// aws
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
// date library
import moment from 'moment';
// logic class
import { UserStatisticInfo } from './class/userStatisticInfo.class';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
import { S3StreamData, OrganizedData } from './interface/S3StreamData.interface';
// dto
import { FindS3StreamInfo } from './dto/findS3StreamInfo.dto';
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { UsersService } from '../users/users.service';

// aws s3
dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class StreamAnalysisService {
  constructor(
    @InjectRepository(StreamsEntity)
      private readonly streamsRepository: Repository<StreamsEntity>,
    @InjectRepository(StreamSummaryEntity)
      private readonly streamSummaryRepository: Repository<StreamSummaryEntity>,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  /*
    기간 추이 분석
    input   : [{creatorId, streamId, startedAt}, {creatorId, streamId, startedAt}, ...]
    output  : [
      {time_line, total_index, start_date, end_date}, 
      {time_line, total_index, start_date, end_date}, ... 
    ]
  */
  async getStreamList(s3Request: FindS3StreamInfo[]): Promise<any> {
    const keyArray : string[] = [];
    const calculatedArray : S3StreamData[] = [];
    const dataArray : S3StreamData[] = [];

    /* input param 을 통해 S3 키 배열 생성 함수 정의 */
    const keyFunc = (stream: any) => new Promise((resolveKeys, reject) => {
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
              resolveKeys();
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });

    /* S3 키 배열을 통해 해당 키와 일치하는 모든 방송 조회  함수 정의 */
    const dataFunc = (key: any) => new Promise<void>((resolveData, reject) => {
      const param = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: key
      };

      const streamData = s3.getObject(param).promise()
        .then((data) => {
          /* S3 body 에서 Obejct Array 로 변경 */
          const JsonData: S3StreamData = JSON.parse(data.Body.toString('utf-8'));
          dataArray.push({
            start_date: JsonData.start_date,
            end_date: JsonData.end_date,
            time_line: JsonData.time_line,
            total_index: JsonData.total_index,
          });
          resolveData();
        })
        .catch((err) => {
          reject(err);
        });

      return streamData;
    });

    /* 분리된 방송 처리 함수 정의 */
    const detachFunc = (stream: S3StreamData): void => {
      calculatedArray.push(stream);
    };

    /* 겹처진 방송 처리 함수 정의 */
    const crossFunc = (currStream: S3StreamData, nextStream: S3StreamData): S3StreamData => {
      let gapSize = 0; // 두 방송의 갭 인덱스 크기
      let gapStartIndex = 0; // 현재 방송에서 갭 시작 인덱스 위치
      let isContained = false; // 현재 방송이 다음 방송을 포함 하는 경우 플래그

      /* 현재 방송에 다음 방송이 포함 되는 경우 (끝점 일치 포함) */
      if (moment(currStream.end_date) >= moment(nextStream.end_date)) {
        isContained = true;
        const timeDuration = moment(nextStream.start_date).diff(moment(currStream.start_date), 'seconds');
        gapSize = nextStream.total_index;
        gapStartIndex = Math.round(timeDuration / 30);
      } else {
        /* 현재 방송에 다음 방송이 일부 겹치는 경우 */
        const timeDuration = moment(currStream.end_date).diff(moment(nextStream.start_date), 'seconds');
        gapSize = Math.round(timeDuration / 30);
        gapStartIndex = currStream.total_index - gapSize;
      }

      const nextStreamTimeline = nextStream.time_line;
      let i = gapStartIndex;
      let j = 0;

      try {
        for (i = gapStartIndex; i < gapStartIndex + gapSize; i += 1) {
          nextStreamTimeline[j].chat_count += currStream.time_line[i].chat_count;
          nextStreamTimeline[j].smile_count += currStream.time_line[i].smile_count;
          j += 1;
        }

        const currTimeline = currStream.time_line.slice(0, gapStartIndex);
        const combinedTimeLine = currTimeline.concat(nextStreamTimeline);

        /* 현재 방송과 다음 방송의 포함 관계에 따른 리턴값 설정 */
        const combiendS3StreamData = {
          start_date: currStream.start_date,
          end_date: isContained ? currStream.end_date : nextStream.end_date,
          time_line: isContained ? combinedTimeLine.concat(
            currStream.time_line.splice(gapStartIndex + gapSize - 1, currStream.time_line.length)
          ) : combinedTimeLine,
          total_index: isContained
            ? currStream.total_index : currStream.total_index + nextStream.total_index - gapSize,
        };

        return combiendS3StreamData;
      } catch (e) {
        return {
          ...currStream
        };
      }
    };

    /* 조회된 S3 데이터 리스트 연산 수행 함수 정의 */
    const calculateData = () => new Promise<S3StreamData[]>((resolveCalculate, reject) => {
      /* 시작 날짜 기준 오름 차순 , 시작 날짜 동일 시 방송 길이 기준 오름 차순 */
      const ASCdataArray = dataArray.sort((obj1, obj2) => {
        if (moment(obj1.start_date) > moment(obj2.start_date)) return 1;
        if (moment(obj1.start_date) < moment(obj2.start_date)) return -1;
        if (moment(obj1.start_date) === moment(obj2.start_date)) {
          if (obj1.time_line.length >= obj2.time_line.length) return 1;
          return -1;
        }
        return 0;
      });

      /* S3 방송 리스트 순차처리 */
      try {
        for (let i = 0; i <= ASCdataArray.length - 1; i += 1) {
          if (i !== ASCdataArray.length - 1) {
            /* 루프 현재 방송과 다음 방송의 겹침 여부 판단 후 로직 수행 */
            const currStream = ASCdataArray[i];
            const nextStream = ASCdataArray[i + 1];
            if (moment(currStream.end_date) >= moment(nextStream.start_date)) {
              /* 겹쳐진 방송은 하나로 합쳐 다음 루프 수행 */
              ASCdataArray[i + 1] = crossFunc(currStream, nextStream);
            } else {
              /* 분리 혹은 루프의 마지막 방송일 경우 결과배열에 삽입 후 루프 수행 */
              detachFunc(currStream);
            }
          } else {
            const currStream = ASCdataArray[i];
            detachFunc(currStream);
            resolveCalculate(calculatedArray);
          }
        }
      } catch (e) {
        reject(e);
      }
    });

    /* 리턴 데이터 포맷 설정 함수 정의 */
    const organizeData = () => new Promise<OrganizedData>(
      (resolveOrganize, rejectOrganize) => {
        const organizeArray: OrganizedData = {
          avgChatCount: 0,
          avgViewer: 0,
          timeLine: []
        };

        try {
        /* 각 타임라인 date 삽입과 동시에 병합 */
          calculatedArray.forEach((s3Data, index) => {
            s3Data.time_line.forEach((timeline, timelineIndex) => {
              organizeArray.avgChatCount += timeline.chat_count;

              organizeArray.timeLine.push({
                smileCount: timeline.smile_count,
                chatCount: timeline.chat_count,
                date: (moment(s3Data.start_date).add(timelineIndex * 30, 'seconds')).format('YYYY-MM-DD HH:mm:ss')
              });
            });
            if (index === calculatedArray.length - 1) {
              organizeArray.avgViewer = 1000; // 평균 시청자수 계산 로직 작성후 추후 추가
              organizeArray.avgChatCount /= organizeArray.timeLine.length;
              resolveOrganize(organizeArray);
            }
          });
        } catch (err) {
          rejectOrganize(err);
        }
      }
    );

    /* S3 데이터 조회 Promise.all 함수 선언 */
    const getAllKeys = (list: FindS3StreamInfo[]) => Promise.all(
      list.map((stream) => keyFunc(stream))
    );
    const getAllDatas = (list: string[]) => Promise.all(
      list.map((stream) => dataFunc(stream))
    );

    /* S3 데이터 조회 후 연산 함수 실행 */
    const result = await getAllKeys(s3Request).then(() => getAllDatas(keyArray) // 조회
      .then(() => calculateData() // 연산
        .then(() => organizeData() // 데이터 포맷 변경
          .then((organizeArray) => organizeArray))

        .catch((err) => {
          /* Promise Chain rejected 처리 */
          throw new InternalServerErrorException(err, 'Calculate Data Error ... ');
        })).catch((err) => {
        throw new InternalServerErrorException(err, 'Calculate Data Error ... ');
      }));

    return result;
  }

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
        .select(['streamId', 'platform', 'title', 'startedAt', 'airTime', ])
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
    input   :  terms: [{startAt , endAt , userId}, {startAt, endAt,userId}]
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
