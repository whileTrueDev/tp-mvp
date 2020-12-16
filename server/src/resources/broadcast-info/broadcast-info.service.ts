import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';

// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';

Injectable();
export class BroadcastInfoService {
  constructor(
    @InjectRepository(StreamsEntity)
      private readonly streamsTest2Repository: Repository<StreamsEntity>,
  ) {}

  /**
   * 입력 받은 기간 내 분석이 끝난 방송 정보 리스트 조회 함수
   * @param userId 로그인 한 유저 아이디 (요청자)
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   */
  async findDayStreamList(
    userId: string,
    startDate: string, endDate: string,
  ): Promise<StreamDataType[]> {
    const momentStart = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
    const momentEnd = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
    const compeleteAnalysisFlag = 0;

    const TermStreamsData: StreamDataType[] = await this.streamsTest2Repository
      .createQueryBuilder('streams')
      .innerJoin(
        StreamSummaryEntity,
        'streamSummary',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform',
      )
      .select(['streams.*, streamSummary.smileCount as smileCount'])
      .where('streams.userId = :id', { id: userId })
      .andWhere('streams.needAnalysis = :compeleteAnalysisFlag', { compeleteAnalysisFlag })
      .andWhere('streams.startDate >= :startDate', { startDate: momentStart })
      .andWhere('streams.startDate < :endDate', { endDate: momentEnd })
      .orderBy('streams.startDate', 'ASC')
      .execute()
      .catch((err) => new InternalServerErrorException(err, 'Mysql Error in BroadcastService ... '));

    return TermStreamsData;
  }
}