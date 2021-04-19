import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import { RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
// database entities
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';

Injectable();
export class BroadcastInfoService {
  constructor(
    @InjectRepository(StreamsEntity)
      private readonly streamsRepository: Repository<StreamsEntity>,
  ) {}

  /**
   * 입력 받은 기간 내 분석이 끝난 방송 정보 리스트 조회 함수
   * @param userId 로그인 한 유저 아이디 (요청자)
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * 
   * @return 방송 정보 리스트
   */
  async findDayStreamList(
    userId: string,
    startDate: string, endDate: string,
  ): Promise<StreamDataType[]> {
    const momentStart = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
    const momentEnd = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
    const compeleteAnalysisFlag = 0; // needAnalysis , 분석 완료 값을 비교하기 위한 체크값 (현재 0 이 완료이므로 0 으로 설정)

    const TermStreamsData: StreamDataType[] = await this.streamsRepository
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

  /**
   * 관리자 페이지 이용자DB 조회 탭에서 사용
   * userId로 해당 이용자의 전체 방송 목록 조회하여 날짜 내림차순으로 반환
   * @param userId 
   */
  async getStreamsByUserId(userId: string): Promise<BroadcastDataForDownload[]> {
    const result: BroadcastDataForDownload[] = await this.streamsRepository
      .createQueryBuilder('streams')
      .select(['streams.streamId, streams.platform, streams.title, streams.startDate, streams.endDate, streams.creatorId'])
      .where('streams.userId = :userId', { userId })
      .orderBy('streams.startDate', 'DESC')
      .execute()
      .catch((err) => new InternalServerErrorException(err, 'Mysql Error in BroadcastService ... '));
    return result;
  }

  /**
   * creatorId 해당 이용자의 전체 방송 목록 조회하여 날짜 내림차순으로 반환
   * @param userId 
   */
  async getStreamsByCreatorId(creatorId: string, limit = 5): Promise<RecentStreamResType> {
    const result = await this.streamsRepository
      .createQueryBuilder('streams')
      .select(
        ['streamId', 'title', 'startDate', 'viewer'],
      )
      .where('streams.creatorId = :creatorId', { creatorId })
      .orderBy('streams.startDate', 'DESC')
      .take(limit)
      .execute()
      .catch((err) => new InternalServerErrorException(err, 'Mysql Error in BroadcastService ... '));
    return result;
  }
}
