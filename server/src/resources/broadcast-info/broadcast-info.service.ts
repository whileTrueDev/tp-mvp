import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { BroadcastDataForDownload } from '@truepoint/shared/dist/interfaces/BroadcastDataForDownload.interface';
import { RecentStream, RecentStreamResType } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
// database entities
import { ConfigService } from '@nestjs/config';
import { CreateStreamVoteDto } from '@truepoint/shared/dto/broadcast-info/CreateStreamVote.dto';
import { StreamsEntity } from './entities/streams.entity';
import { StreamSummaryEntity } from './entities/streamSummary.entity';
import { StreamVotesEntity } from './entities/streamVotes.entity';
import { UserEntity } from '../users/entities/user.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';

Injectable();
export class BroadcastInfoService {
  streamsTableName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(StreamsEntity)
    private readonly streamsRepository: Repository<StreamsEntity>,
    @InjectRepository(StreamVotesEntity)
    private readonly streamVoteRepo: Repository<StreamVotesEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepo: Repository<PlatformAfreecaEntity>,
    @InjectRepository(PlatformTwitchEntity)
    private readonly twitchRepo: Repository<PlatformTwitchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
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
      .query(
        `SELECT
          streamId, title, startDate, endDate, viewer, chatCount,
          IFNULL(SUM(vote), 0) AS likeCount,
          IFNULL(COUNT(*) - SUM(vote), 0) AS hateCount
        FROM ${this.streamsTableName} as s
        LEFT JOIN ${this.streamVoteRepo.metadata.tableName} as sv ON s.streamId = sv.streamStreamId
        WHERE s.creatorId = ?
        GROUP BY streamId
        ORDER BY s.startDate DESC
        LIMIT ?`, [creatorId, limit],
      );

    return result;
  }

  /**
   * 1개의 스트림을 조회합니다.
   * @param streamId 스트림 고유 ID
   * @returns StreamEntity
   */
  async findOneSteam(streamId: string): Promise<RecentStream> {
    const result = await this.streamsRepository
      .query(
        `SELECT streamId, title, startDate, endDate, viewer, chatCount,
          IFNULL(SUM(vote), 0) AS likeCount,
          IFNULL(COUNT(*) - SUM(vote), 0) AS hateCount
        FROM ${this.streamsTableName} as s
        LEFT JOIN ${this.streamVoteRepo.metadata.tableName} as sv ON s.streamId = sv.streamStreamId
        WHERE s.streamId = ?`, [streamId],
      );
    if (result.length === 0) return null;
    return result[0];
  }

  /**
   * 방송에 대한 좋아요/싫어요를 생성합니다.
   * @param dto CreateStreamVoteDto
   * @returns 좋아요/싫어요 반영 이후 좋아요/싫어요 숫자
   */
  async vote(dto: CreateStreamVoteDto & { ip: string }): Promise<number> {
    // id 를 보내야 한다.
    const stream = { streamId: dto.streamId, platform: dto.platform };
    // *********************************
    // 있으면 업데이트, 없으면 등록
    const data = this.streamVoteRepo.create({
      id: dto.id,
      userIp: dto.ip,
      vote: dto.vote === 'up',
      stream,
    });
    await this.streamVoteRepo.save(data);

    return this.streamVoteRepo.count({ vote: dto.vote === 'up' });
  }

  /**
   * 좋아요/싫어요를 취소합니다.
   * @param id 취소할 vote아이디
   * @returns 1 | 0
   */
  async cancelVote(id: number): Promise<number> {
    // 1. vote 취소
    const result = await this.streamVoteRepo.delete(id);
    return result.affected;
  }

  /**
   * 해당 방송에 해당 IP를 가진 유저가 진행한 좋아요/싫어요 내역을 조회합니다.
   * @param ip 요청자 IP
   * @param streamId 좋아요/싫어요 표시한 방송ID
   * @returns StreamVoteEntity
   */
  async checkIsVotedByIp(ip: string, streamId: string): Promise<StreamVotesEntity> {
    return this.streamVoteRepo.findOne({
      where: {
        userIp: ip,
        stream: streamId,
      },
      order: {
        createDate: 'DESC',
      },
    });
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
