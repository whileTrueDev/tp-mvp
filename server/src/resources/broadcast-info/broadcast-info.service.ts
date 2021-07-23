import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
// database entities
import { ConfigService } from '@nestjs/config';
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { UserEntity } from '../users/entities/user.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { UsersService } from '../users/users.service';
import dayjsFormatter from '../../utils/dateExpression';

Injectable();
export class BroadcastInfoService {
  streamsTableName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(StreamsEntity)
    private readonly streamsRepository: Repository<StreamsEntity>,
    private readonly usersService: UsersService,
  ) {
    this.streamsTableName = this.configService.get('NODE_ENV') === 'production' ? this.streamsRepository.metadata.tableName : 'Streams';
  }

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
    const formattedStart = dayjsFormatter(startDate, 'default');
    const formattedEnd = dayjsFormatter(endDate, 'default');

    const compeleteAnalysisFlag = 0; // needAnalysis , 분석 완료 값을 비교하기 위한 체크값 (현재 0 이 완료이므로 0 으로 설정)

    const creatorIds = await this.usersService.findOneCreatorIds(userId);

    const TermStreamsData: StreamDataType[] = await this.streamsRepository
      .createQueryBuilder('streams')
      .innerJoin(
        StreamSummaryEntity,
        'streamSummary',
        'streams.streamId = streamSummary.streamId and streams.platform = streamSummary.platform',
      )
      .select(['streams.*, streamSummary.smileCount as smileCount'])
      .where('streams.creatorId IN (:id)', { id: creatorIds })
      .andWhere('streams.needAnalysis = :compeleteAnalysisFlag', { compeleteAnalysisFlag })
      .andWhere('streams.startDate >= :startDate', { startDate: formattedStart })
      .andWhere('streams.startDate < :endDate', { endDate: formattedEnd })
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

  async getTodayTopViewerUserByPlatform(): Promise<any> {
    const result = await this.streamsRepository.createQueryBuilder('stream')
      .innerJoin(UserEntity, 'u', 'u.userId = stream.userId')
      .leftJoin(PlatformAfreecaEntity, 'a', 'a.afreecaId = u.userId')
      .leftJoin(PlatformTwitchEntity, 't', 't.twitchChannelName = u.userId')
      .select(['creatorId', 'platform', 'nickName'])
      .groupBy('stream.platform')
      .addSelect('max(viewer)', 'viewer')
      .addSelect('a.logo', 'afreecaLogo')
      .addSelect('t.logo', 'twitchLogo')
      // .where('"2021-04-19" = DATE(stream.startDate)') // 테스트용 (오늘데이터가 없어 확인불가하여 테스트용으로 하드코딩)
      .where('CURDATE() = DATE(stream.startDate)') // 배포용
      .execute();

    return result;
  }
}
