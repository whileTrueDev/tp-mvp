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
// import { dataArray } from './s3TestData.test';
// logic class
import { UserStatisticInfo } from './class/userStatisticInfo.class';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
import { DayStreamsInfo } from './interface/dayStreamInfo.interface';
import { S3StreamData, OrganizedData } from './interface/S3StreamData.interface';
import { PeriodAnalysis } from './interface/periodAnalysis.interface';
import { PeriodsAnalysis } from './interface/periodsAnalysis.interface';
import { StreamAnalysis } from './interface/streamAnalysis.interface';

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

const calculateStreamData = (streamData : StreamsInfo[]) => {
  const template = [
    {
      title: '평균 시청자 수',
      tag: 'viewer',
      key: 'viewer',
      value: [],
      unit: '명'
    },
    {
      title: '웃음 발생 수',
      tag: 'smile',
      key: 'smileCount',
      value: [],
      unit: '회'
    },
    {
      title: '채팅 발생 수',
      tag: 'chat',
      key: 'chatCount',
      value: [],
      unit: '회'
    }
  ];

  const result = template.map((element) => {
    const broad1Count = streamData[0][element.key];
    const broad2Count = streamData[1][element.key];
    const sum = broad1Count + broad2Count;
    const broad1 = sum === 0 ? 0 : Math.round((broad1Count / sum) * 100);
    const broad2 = sum === 0 ? 0 : Math.round((broad2Count / sum) * 100);
    const returnValue = {
      ...element,
      broad1Count,
      broad2Count,
      diff: broad2 - broad1
    };
    returnValue.value.push(
      {
        category: '',
        broad1: -1 * broad1,
        broad2
      }
    );
    delete returnValue.key;
    return returnValue;
  });
  return result;
};

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
        .innerJoin(
          StreamSummaryEntity,
          'streamSummary',
          'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
        )
        .select(['streams.*'])
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
      .innerJoin(
        StreamSummaryEntity,
        'streamSummary',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
      )
      .select(['streams.*'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.startedAt >= :startDate', { startDate: startAt })
      .andWhere('streams.startedAt < :endDate', { endDate: endAt })
      .orderBy('streams.startedAt', 'ASC')
      .execute();

    return TermStreamsData;
  }

  /*
    input   :  streamId , platform
    output  :  chat_count , smile_count , viewer
  */
  async findStreamInfoByStreamId(streams: FindStreamInfoByStreamId): Promise<(StreamAnalysis| null)[]> {
    if (streams[0]) {
      const streamInfoBase: StreamsInfo[] = await this.streamSummaryRepository
        .createQueryBuilder('streamSummary')
        .innerJoin(
          StreamsEntity,
          'streams',
          'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
        )
        .select(['streamSummary.*', 'viewer', 'chatCount', 'title'])
        .where('streamSummary.streamId = :id', { id: streams[0].streamId })
        .andWhere('streamSummary.platform = :platform', { platform: streams[0].platform })
        .execute()
        .catch((err) => {
          throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
        });

      if (streams[1]) {
        const streamInfoCompare: StreamsInfo[] = await this.streamSummaryRepository
          .createQueryBuilder('streamSummary')
          .innerJoin(
            StreamsEntity,
            'streams',
            'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform'
          )
          .select(['streamSummary.*', 'viewer', 'chatCount', 'title'])
          .where('streamSummary.streamId = :id', { id: streams[1].streamId })
          .andWhere('streamSummary.platform = :platform', { platform: streams[1].platform })
          .execute()
          .catch((err) => {
            throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
          });

        const streamData = [streamInfoBase[0], streamInfoCompare[0]];
        return calculateStreamData(streamData);
      }
      // return [streamInfoBase, null];
    }
    return [null, null];
  }

  /*
    기간 대 기간을 비교하기 위한 service
    input   :  terms: [{startAt , endAt , userId}, {startAt, endAt,userId}]
    output  :  
    { 
      timeline : [
        {viewer, chatCount, smileCount, date}, 
        {viewer, chatCount, smileCount, date},
        ...
      ],
      type: 'periods',
      metrics: [  
        {
          title: '평균 시청자 수',
          tag: 'viewer',
          key: 'viewer',
          value: [],
          unit: '명'
        },
        {
          title: '웃음 발생 수',
          tag: 'smile',
          key: 'smileCount',
          value: [],
          unit: '회'
        },
        {
          title: '채팅 발생 수',
          tag: 'chat',
          key: 'chatCount',
          value: [],
          unit: '회'
        }
      ]
    }
  */
  async findStreamInfoByPeriods(userId: string, periods: {startAt: string, endAt: string}[])
  : Promise<PeriodsAnalysis> {
    // 전달되는 형태가 두개의 기간으로 전달되어야한다.
    return new Promise((resolve) => {
      Promise.all(
        periods.map(({ startAt, endAt }) => {
          // 1. 곡선 그래프를 위한 데이터 구현
          const query = `
          SELECT ROUND(AVG(viewer)) as viewer, 
            ROUND(AVG(chatCount)) as chatCount,  
            ROUND(AVG(smileCount)) AS smileCount, 
            DATE_FORMAT(startedAt, "%Y-%m-%d") AS date
          FROM Streams JOIN StreamSummary
          USING (streamId, platform)
          WHERE userId IN (
            SELECT targetUserId 
            FROM Subscribe 
            WHERE userId = ?
          )
          AND startedAt BETWEEN ? AND ?
          GROUP BY date
          ORDER BY date`;
          return this.streamSummaryRepository
            .query(query, [userId, startAt, endAt])
            .catch((err) => {
              throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
            });
        })
      )
        .then((timeline) => {
          const metrics = timeline.map((period) => period.reduce((sum, element) => [
            sum[0] + Number(element.viewer),
            sum[1] + Number(element.chatCount),
            sum[2] + Number(element.smileCount)
          ], [0, 0, 0]))
            .map((sums, index) => ({
              viewer: Math.round(sums[0] / timeline[index].length),
              chatCount: Math.round(sums[1] / timeline[index].length),
              smileCount: Math.round(sums[2] / timeline[index].length),
            }));

          resolve({
            timeline,
            type: 'periods',
            metrics: calculateStreamData(metrics)
          });
        });
    });
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

  /*
    기간 추이 분석
    input   : streams: [{creatorId, streamId, startedAt}, {creatorId, streamId, startedAt}, ...]
    output  : {
      start_date,
      end_date,
      chat_count,
      view_count,
      value: [
        {
          smile_count,
          chat_count,
          viewer => 분석기에 아직 탑재 미완료.
          date
        },
        { smile_count, chat_count, viewer, date },
        ...
      ],
    }
  */
  async findStreamInfoByPeriod(s3Request: FindS3StreamInfo[]): Promise<PeriodAnalysis> {
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
            });
          }
          resolveKeys();
        })
        .catch((err) => {
          reject(err);
        });
    });

    /* S3 키 배열을 통해 해당 키와 일치하는 모든 방송 조회  함수 정의 */
    const dataFunc = (key: any) => new Promise<void>((resolveData, reject) => {
      if (keyArray.length < 1) reject(new Error('Empty S3 Key Array ...'));

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
      if (dataArray.length < 1) reject(new Error('Empty S3 Data Array ...'));
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
          start_date: calculatedArray[0].start_date,
          end_date: calculatedArray[calculatedArray.length - 1].end_date,
          chat_count: 0,
          view_count: 0,
          value: [],
        };

        try {
          /* 각 타임라인 date 삽입과 동시에 병합 */
          calculatedArray.forEach((s3Data, index) => {
            s3Data.time_line.forEach((timeline, timelineIndex) => {
              organizeArray.chat_count += timeline.chat_count;

              organizeArray.value.push({
                smile_count: timeline.smile_count,
                chat_count: timeline.chat_count,
                date: (moment(s3Data.start_date).add(timelineIndex * 30, 'seconds')).format('YYYY-MM-DD HH:mm:ss')
              });
            });
            if (index === calculatedArray.length - 1) {
              organizeArray.view_count = 1000; // 평균 시청자수 계산 로직 작성후 추후 추가
              organizeArray.chat_count = Math.round(organizeArray.chat_count / organizeArray.value.length);

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
        .catch((err: Error) => {
        /* Promise Chain rejected 처리 */
          console.log('[Error] : ', err.message);
          throw new InternalServerErrorException(err, 'Calculate Data Error ... ');
        })).catch((err: Error) => {
        console.log('[Error] : ', err.message);
        throw new InternalServerErrorException(err);
      }));

    return result;
  }
}
