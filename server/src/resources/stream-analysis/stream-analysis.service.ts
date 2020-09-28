import {
  Injectable, InternalServerErrorException, HttpException, HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import dataArray from './data';

// logic class
import { UserStatisticInfo } from './class/userStatisticInfo.class';
// interface
import { StreamsInfo } from './interface/streamsInfo.interface';
// dto
import { FindStreamInfoByStreamId } from './dto/findStreamInfoByStreamId.dto';
// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';

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
  ) {}
  /*
    input   :  streamId , platform
    output  :  chat_count , smile_count , viewer
  */
  async findStreamInfoByStreamId(streams: FindStreamInfoByStreamId)
  : Promise<any> {
    if (streams[0]) {
      const streamInfoBase: StreamsInfo[] = await this.streamSummaryRepository
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
        const streamInfoCompare: StreamsInfo[] = await this.streamSummaryRepository
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

        // 비교분석을 위한 데이터 전처리
        if (streamInfoBase.length === 0 || streamInfoCompare.length === 0) {
          return [null, null];
        }
        const streamData = [streamInfoBase[0], streamInfoCompare[0]];
        return calculateStreamData(streamData);
      }
      return [streamInfoBase, null];
    }
    return [null, null];
  }

  /*
    input   :  startAt , endAt , userId
    output  :  chat_count , smile_count , viewer or subscribe_count
  */
  async findStreamInfoByPeriods(userId: string, periods: {startAt: string, endAt: string}[])
  : Promise<any> {
    // 전달되는 형태가 두개의 기간으로 전달되어야한다.
    return new Promise((resolve, reject) => {
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
          // 2. 지표별 그래프를 위한 데이터 구현
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

  async getData(): Promise<any> {
    let out = [];
    // dataArray를 하나씩 돌면서 
    dataArray.forEach((data, index) => {
      if (index === 0) {
        out = data.time_line.map((element, inindex) => {
          const standard = new Date(data.start_date);
          standard.setSeconds(standard.getSeconds() + (30 * inindex));
          if (inindex % 6 === 0) {
            return ({ ...element, date: standard, viewer: Math.random() * 1000 });
          }
          return ({ ...element, date: standard });

          // return { ...element, date: standard };
        });
      } else {
        data.time_line.forEach((element, inindex) => {
          const standard = new Date(data.start_date);
          standard.setSeconds(standard.getSeconds() + (30 * inindex));
          if (inindex % 6 === 0) {
            out.push({ ...element, date: standard, viewer: Math.round(Math.random() * 1000) });
          } else {
            out.push({ ...element, date: standard });
          }
        });
      }
    });

    return {
      start_date: '2020-09-16 18:21:00',
      end_date: '2020-09-19 16:50:00',
      view_count: 247,
      chat_count: 1300,
      value: out
    };
  }
}
