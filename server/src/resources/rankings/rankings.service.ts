import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  DailyTotalViewersResType,
  TopTenDataItem,
  RankingDataType, DailyTotalViewersData, WeeklyTrendsType,
} from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { RankingsEntity } from './entities/rankings.entity';
import { CreatorRatingsEntity } from '../creatorRatings/entities/creatorRatings.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';

export type ScoreColumn = 'smileScore'|'frustrateScore'|'admireScore'|'cussScore';
export type ColumnType = 'smile'| 'frustrate'| 'admire'| 'cuss' | 'viewer' | 'rating';
export type PlatformType = 'all' | 'twitch' | 'afreeca';

export interface getTopTenByColumnArgs{
  column: ColumnType,
  skip: number,
  categoryId: number,
  platform: PlatformType
}

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(RankingsEntity)
    private readonly rankingsRepository: Repository<RankingsEntity>,
  ) {}

  /**
   * 최근분석시간 기준 24시간 내 해당 점수 상위 10명의 방송정보를 뽑아내는 함수
   * 
   * 최근분석시간으로부터 24시간 내 방송에 대해 크리에이터별로 최고 점수를 구한 테이블(t2)을 만들고
   * rankings테이블(t1)에서 최고 점수(t2.maxScore)인 데이터를 가져와
   * 점수순으로 내림차순하여 10개를 가지고온다
   * 자기 조인 예시
   * 
   * @param column "smile" | "frustrate" | "admire" | "cuss" | "viewer"
   * @param skip 해당 숫자만큼 이후의 데이터를 가져옴
   * @param categoryId 크리에이터 필터링 할 categoryId
   * @param platform 'twitch' | 'afreeca' | 'all'
   * @param errorHandler (error: any) => void 에러핸들링 할 함수
   * @return {
      rankingData : {
                     creatorId: string;
                     id: number;
                     platform: string;
                     creatorName: string;
                     title: string;
                     streamDate: Date;
                     averageRating? number;
                     [key:ScoreColumn]: number;
                   }
      weeklyTrends : {[key:string] : [ { createDate: string; [key:targetColumn]: number }],
      totalDataCount: number
    }
   }
   */
  private async getTopTenByColumn(
    args: getTopTenByColumnArgs,
    errorHandler?: (error: any) => void,
  ): Promise<RankingDataType> {
    const {
      column, skip, categoryId, platform: platformType,
    } = args;

    const targetColumn = column === 'viewer'
      ? column
      : `${column}Score`;

    try {
      // 최근분석날짜
      const recentAnalysisDate = await this.getRecentAnalysysDate();
      // 공통쿼리
      const baseQuery = await getConnection()
        .createQueryBuilder()
        .select([
          `T1.${targetColumn} AS ${targetColumn}`,
          'T1.id AS id',
          'T1.creatorId AS creatorId',
          'T1.creatorName AS creatorName',
          'T1.title AS title',
          'T1.createDate AS createDate',
          'T1.platform AS platform',
          'AVG(ratings.rating) AS averageRating',
        ])
        .addFrom((subQuery) => subQuery // 최근분석시간 기중 24시간 내 방송을 creatorId별로 그룹화하여 creatorId와 최대점수를 구한 테이블(t2)
          .select([
            `MAX(rankings.${targetColumn}) AS maxScore`,
            'rankings.creatorId AS creatorId',
          ])
          .from(RankingsEntity, 'rankings')
          .groupBy('rankings.creatorId')
          .where(`streamDate > DATE_SUB('${recentAnalysisDate}', INTERVAL 1 DAY)`),
        'MaxValueTable')
        .from(RankingsEntity, 'T1')
        .groupBy('T1.creatorId')
        .where('T1.creatorId = MaxValueTable.creatorId')
        .leftJoin(CreatorRatingsEntity, 'ratings', 'ratings.creatorId = T1.creatorId')
        .andWhere(`T1.${targetColumn} = MaxValueTable.maxScore`); // 최대점수를 가지는 레코드의 정보를 가져온다(t2와 T1의 creatorId와 점수가 같은 레코드)

      let qb: SelectQueryBuilder<RankingsEntity>;
      if (platformType === 'all') {
        // 전체(아프리카 + 트위치) 추가 쿼리
        qb = await baseQuery
          .addSelect([
            'Twitch.logo AS twitchProfileImage',
            'Twitch.twitchChannelName AS twitchChannelName',
            'Afreeca.logo AS afreecaProfileImage',
          ])
          .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = T1.creatorId')
          .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = T1.creatorId');

        if (categoryId !== 0) {
          qb = await qb
            .leftJoin('Afreeca.categories', 'afreecaCategories')
            .leftJoin('Twitch.categories', 'twitchCategories')
            .andWhere(`(afreecaCategories.categoryId = ${categoryId} OR twitchCategories.categoryId = ${categoryId})`);
        }
      } else if (platformType === 'twitch') {
        // 트위치 추가 쿼리
        qb = await baseQuery
          .addSelect([
            'Twitch.logo AS twitchProfileImage',
            'Twitch.twitchChannelName AS twitchChannelName',
          ])
          .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = T1.creatorId')
          .andWhere('T1.platform =:platformType', { platformType: 'twitch' });
        if (categoryId !== 0) {
          qb = await qb
            .leftJoin('Twitch.categories', 'twitchCategories')
            .andWhere(`(twitchCategories.categoryId = ${categoryId})`);
        }
      } else if (platformType === 'afreeca') {
        // 아프리카 추가 쿼리
        qb = await baseQuery
          .addSelect([
            'Afreeca.logo AS afreecaProfileImage',
          ])
          .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = T1.creatorId')
          .andWhere('T1.platform =:platformType', { platformType: 'afreeca' });

        if (categoryId !== 0) {
          qb = await qb
            .leftJoin('Afreeca.categories', 'afreecaCategories')
            .andWhere(`(afreecaCategories.categoryId = ${categoryId})`);
        }
      }

      // 해당 조건에 맞는 offset, limit 적용하지 않은 총 데이터 개수
      const totalData = await qb.clone().getRawMany();
      const totalDataCount = totalData.length;

      const rankingData: TopTenDataItem[] = await qb
        .orderBy(`T1.${targetColumn}`, 'DESC')
        .offset(skip)
        .limit(10)
        .getRawMany();

      // 상위 10명 크리에이터의 아이디를 뽑아낸다
      const topTenCreatorIds = rankingData.map((d) => d.creatorId);
      // 상위 10명 크리에이터의 최근 7개 방송 점수 동향을 구함
      const weeklyTrends = await this.getTopTenTrendsByColumn(topTenCreatorIds, column, console.error);

      return {
        rankingData: rankingData.map((d) => ({ ...d, averageRating: Number(d.averageRating) })),
        weeklyTrends,
        totalDataCount,
      };
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      }
      throw new InternalServerErrorException(error, `error in getTopTenByColumn column:${column}`);
    }
  }

  /**
   * 상위 10인의 creatorId를 받아와 해당 방송인의 최근 7개방송 날짜와 점수를 찾는다
   * 
   * Rankings 테이블에서 상위 10인 creatorId인 데이터에 대하여
   * 해당 점수, 날짜, creatorId, 순위(크리에이터별로 묶어서 최신순으로 매김 - 최근 7개 방송을 가져오기 위해서) 가지고 있는 테이블(t)를 만든다
   * 테이블 t에 대하여 순위가 7 이하인 값들(=최근 7개 방송 데이터)을 가져온다
   * 
   * @param topTenCreatorIds 상위 10인의 creatorId array
   * @param column 기준 점수 컬럼 "smileScore" | "frustrateScore" | "admireScore" | "cussScore"
   * @param errorHandler (error: any) => void 에러핸들링 할 함수
   * @return {[key:string] : [ { createDate: string; [key:ScoreColumn]: number }]}
   * 예시: { creatorId: [ {createDate: "2021-3-5", cussScore: 9.861}, ... ], }
   */
  private async getTopTenTrendsByColumn(
    topTenCreatorIds: string[],
    column: ColumnType,
    errorHandler?: (error: any) => void,
  ): Promise<WeeklyTrendsType> {
    try {
      const targetColumn = column === 'viewer'
        ? column
        : `${column}Score`;

      const data = await getConnection()
        .createQueryBuilder()
        .select([
          'T.creatorId',
          'T.streamDate',
          `T.${targetColumn}`,
          'T.rnk',
          'T.title',
        ])
        .from((subQuery) => subQuery
          .from(RankingsEntity, 'R')
          .select([
            `R.${targetColumn} AS ${targetColumn}`,
            'DATE_FORMAT(R.streamDate,"%Y-%m-%d") AS streamDate',
            'R.creatorId AS creatorId',
            'R.title AS title',
            `RANK() OVER(PARTITION BY R.creatorId ORDER BY R.streamDate DESC, R.${targetColumn} DESC) AS rnk`,
          ])
          .where(`R.creatorId IN ('${topTenCreatorIds.join("','")}')`),
        'T')
        .where('T.rnk <= 7')
        .getRawMany();

      // 가져온 데이터를 { creatorId: [ {createDate: "2021-3-5", cussScore: 9.861}, ... ], } 형태로 변환함
      const result = topTenCreatorIds.reduce((obj, key) => ({ ...obj, [key]: [] }), {});
      data.reverse().forEach((d) => {
        const { creatorId, streamDate, title } = d;
        result[creatorId].push({ createDate: streamDate, [targetColumn]: d[targetColumn], title });
      });

      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      }
      throw new InternalServerErrorException(error, `error in getTopTenTrendsByColumn column:${column}, creatorIds: ${topTenCreatorIds}`);
    }
  }

  /**
   * * 감탄점수/웃음점수/답답함점수/욕점수/시청자수 상위 10명 뽑아서 반환 -> 반응별랭킹 TOP 10에 사용
   * @param column 
   * @param skip 
   * @param categoryId 
   */
  async getTopTenRank(column: ColumnType,
    skip: number,
    categoryId: number,
    platform: PlatformType): Promise<RankingDataType> {
    // 아직 어떤 에러처리가 필요한지 불확실하여 콘솔에 에러찍는것만 에러핸들러로 넘김
    return this.getTopTenByColumn({
      column, skip, categoryId, platform,
    }, console.error);
  }

  /**
   * Rankings테이블에서 
   * 해당 플랫폼이면서 가장 최근 분석시간으로부터 24시간 내 데이터에 대하여
   * creatorId별로 그룹화하여 최대 시청자수 구하고,
   * 최대시청자수 내림차순으로 정렬하여 
   * 10개의 데이터(최대시청자수 상위10인)의 데이터를 가져옴
   * 
   * 시청자 수 상위 10인의 최대 시청자 수, 활동명, creatorId
   * && 해당 플랫폼의 상위10인 총 시청자수 합 반환
   * 
   * @param platform 'twitch'|'afreeca'
   * @param errorHandler (error: any) => void 에러핸들링 할 함수
   * @return
   * {
   * data: DailyTotalViewerData[], // 시청자 수 상위 10인의 최대 시청자 수,활동명,creatorId
     total: number // 해당 플랫폼의 상위10인 총 시청자수 합
   * }
   * 
   */
  private async getDailyTotalViewersByPlatform(
    platform: 'twitch'|'afreeca',
    errorHandler?: (error: any) => void,
  ): Promise<DailyTotalViewersData> {
    try {
      const recentAnalysisDate = await this.getRecentAnalysysDate();
      const data = await this.rankingsRepository
        .createQueryBuilder('rankings')
        .select([
          'MAX(rankings.viewer) AS maxViewer',
          'rankings.creatorName AS creatorName',
          'rankings.creatorId AS creatorId',
        ])
        .where('rankings.platform =:platform', { platform })
        .andWhere(`streamDate >= DATE_SUB('${recentAnalysisDate}', INTERVAL 1 DAY)`) // 가장 최근 분석시간으로부터 1일 이내
        .groupBy('rankings.creatorId')
        .orderBy('maxViewer', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        data,
        total: data.reduce((sum, item) => sum + item.maxViewer, 0),
      };
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      }
      throw new InternalServerErrorException(`error in getDailyTotalViewersByPlatform platform:${platform}`);
    }
  }

  /**
   * 최근 24시간 내 플랫폼별 최대시청자 10인의 총 시청자수 합 & 개별 최대시청자 정보 반환 
   * -> 플랫폼별 상위 10인의 시청자수 합 카드에 사용
   * @return 
   * {
   *  twitch: { data: [ {"maxViewer": 12248, "creatorName": "꽃핀","creatorId": "Rhcvls"}, ...],
   *            total : number },
   *  afreeca: { data: [ {"maxViewer": 12248, "creatorName": "꽃핀","creatorId": "Rhcvls"}, ...], 
   *            total: number }
   * }
   */
  async getDailyTotalViewers(): Promise<DailyTotalViewersResType> {
    const twitch = await this.getDailyTotalViewersByPlatform('twitch', console.error);
    const afreeca = await this.getDailyTotalViewersByPlatform('afreeca', console.error);

    return { twitch, afreeca };
  }

  /**
   * 가장 최근 분석시간 찾기 max(createDate) from Rankings
   * 데이터 기간 검색 시 기준이 됨
   * @returns 2021-03-15 00:09:34.358000 와 같이 반환
   */
  async getRecentAnalysysDate(): Promise<Date> {
    try {
      const { recentCreateDate } = await this.rankingsRepository.createQueryBuilder('rank')
        .select('max(rank.createDate) AS recentCreateDate')
        .getRawOne();
      return recentCreateDate;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error in getRecentAnalysysDate');
    }
  }
}
