import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
} from 'typeorm';
import { RankingsEntity } from './entities/rankings.entity';

interface MonthlyRankData{
  creatorName: string;
  creatorId: string;
  platform: 'twitch' | 'afreeca';
  avgScore: number;
}
type ScoreColumn = 'smileScore'|'frustrateScore'|'admireScore'|'cussScore';
@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(RankingsEntity)
    private readonly rankingsRepository: Repository<RankingsEntity>,
  ) {}

  /**
   * 월간 월간 웃음/감탄/답답함 점수 순위 구할 때 사용할 기본 쿼리
   * 
   * 현재 기준으로 1개월 내에 생성된 데이터에 대하여
   * creatorName, creatorId, platform정보를 
   * 5개 가져오도록 한다
   */
  private monthlyScoreBaseQuery = this.rankingsRepository
    .createQueryBuilder('rankings')
    .select('creatorName')
    .addSelect('creatorId')
    .addSelect('platform')
    .where('createDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)')
    .groupBy('creatorName')
    .take(5);

  /**
   * monthlyScoreBaseQuery 기본 쿼리를 바탕으로
   * 기준 컬럼(웃음점수, 감탄점수, 답답함점수)에 따라
   * 월간 평균점수컬럼을 추가하고, 
   * 해당 평균점수 별로 내림차순 정렬하여 값을 가져온다
   * @param column 'smileScore'|'frustrateScore'|'admireScore'
   * @return MonthlyRankData[]
    {
      "creatorName": "랄로",
      "creatorId": "fkffh",
      "platform": "twitch",
      "avgScore": 9.3595
    }[]
   */
  async getMonthlyRankByColumn(column: ScoreColumn): Promise<MonthlyRankData[]> {
    const decimalPlace = 2;// 평균점수 소수점 2자리까지만
    try {
      return await this.monthlyScoreBaseQuery.clone()
        .addSelect(`TRUNCATE(AVG(${column}),${decimalPlace})`, 'avgScore')
        .orderBy('avgScore', 'DESC')
        .getRawMany();
    } catch (error) {
      throw new InternalServerErrorException('error in getMonthlySmileRank');
    }
  }

  /**
   * 지난 월간 웃음/감탄/답답함 평균점수 상위 5명씩 뽑아서 반환
   * @return 
   * {
   * smile: MonthlyRankData[],
     frustrate: MonthlyRankData[],
     admire: MonthlyRankData[]
   * }
   */
  async getMonthlyScoresRank(): Promise<{
    smile: MonthlyRankData[],
    frustrate: MonthlyRankData[],
    admire: MonthlyRankData[]
  }> {
    const smile = await this.getMonthlyRankByColumn('smileScore');
    const frustrate = await this.getMonthlyRankByColumn('frustrateScore');
    const admire = await this.getMonthlyRankByColumn('admireScore');
    return {
      smile,
      frustrate,
      admire,
    };
  }

  async getTopTenByColumn(column: ScoreColumn): Promise<any> {
    return [];
  }

  async getTopTenRank(): Promise<any> {
    // 웃음점수 상위 10명 
    // group by로 뽑아온 값중에 가장큰 값(max)의 상태값을 가져오기 http://b1ix.net/87
    const data = await getConnection()
      .createQueryBuilder()
      .select([
        't1.id AS id',
        't1.creatorId AS creatorId',
        't1.creatorName AS creatorName',
        't1.platform AS platform',
        't1.createDate AS createDate',
        't1.smileScore AS smileScore'])
      .addSelect('ROW_NUMBER () OVER (ORDER BY t1.smileScore DESC)', 'rank')
      .from(RankingsEntity, 't1')
      .addFrom((subQuery) => subQuery
        .addSelect('MAX(t2.smileScore)', 'maxScore')
        .addSelect('t2.creatorId', 'creatorId')
        .from(RankingsEntity, 't2')
        .groupBy('t2.creatorName'),
      // .where('createDate >= DATE_SUB(NOW(), INTERVAL 1 DAY)'), // 최근 24시간에 대해서
      't2')
      .where('t1.creatorId = t2.creatorId')
      .andWhere('t1.smileScore = t2.maxScore')
      // .orderBy('smileScore', 'DESC')
      .take(10)
      .getRawMany();

    return data;
  }
}
