import {
  forwardRef,
  Inject,
  Injectable, InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, SelectQueryBuilder } from 'typeorm';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { RankingDataType, WeeklyTrendsType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { AverageRating, CreatorRatingInfoRes, WeeklyRatingRankingRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import dayjs from 'dayjs';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { DailyAverageRatingsEntity } from './entities/dailyAverageRatings.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { PlatformType, RankingsService } from '../rankings/rankings.service';
import { AdminRating } from './creatorRatings.controller';
import dayjsFormatter from '../../utils/dateExpression';

@Injectable()
export class CreatorRatingsService {
  private readonly logger = new Logger(CreatorRatingsService.name);

  // eslint-disable-next-line max-params
  constructor(
    @Inject(forwardRef(() => RankingsService))
    private readonly rankingsService: RankingsService,
    @InjectRepository(CreatorRatingsEntity)
    private readonly ratingsRepository: Repository<CreatorRatingsEntity>,
    @InjectRepository(DailyAverageRatingsEntity)
    private readonly avgRatingRepository: Repository<DailyAverageRatingsEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepository: Repository<PlatformAfreecaEntity>,
    @InjectRepository(PlatformTwitchEntity)
    private readonly twitchRepository: Repository<PlatformTwitchEntity>,
  ) {}

  /**
   * 관리자페이지에서 평점 생성 요청시
   * userId : truepointAdmin_{randomString}
   * 인 데이터를 CreatorRatingsEntity에 생성
   */
  async createRatingByAdmin(data: AdminRating[]): Promise<any> {
    try {
      const values = data.map((d) => ({
        ...d,
        userId: `${d.userId}_${d.userIp}`,
      }));
      const result = await this.ratingsRepository.createQueryBuilder('rating')
        .insert()
        .values([
          ...values,
        ])
        .execute();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findRatingListByUserId({ userId, page, itemPerPage }: {
      userId: string, page: number, itemPerPage: number}): Promise<{
        hasMore: boolean,
        creators: {
          rating: number;
          platform: 'afreeca' | 'twitch',
          creatorId: string,
          creatorDisplayName: string,
          creatorProfileImage: string
        }[]
      }> {
    // userId로 매겨진 rating record
    const query = await this.ratingsRepository.createQueryBuilder('ratings')
      .select([
        'ratings.rating AS rating',
        'ratings.creatorId AS creatorId',
        'ratings.platform AS platform',
      ])
      .where('ratings.userId = :userId', { userId });

    const count = await query.clone().getCount();
    const totalPage = Math.ceil(count / itemPerPage);

    const data = await query
      .addSelect([
        'afreeca.afreecaStreamerName AS afreecaStreamerName',
        'afreeca.logo AS afreecaLogo',
      ])
      .addSelect([
        'twitch.twitchStreamerName AS twitchStreamerName',
        'twitch.logo AS twitchLogo',
      ])
      .leftJoin(PlatformAfreecaEntity, 'afreeca', 'afreeca.afreecaId = ratings.creatorId')
      .leftJoin(PlatformTwitchEntity, 'twitch', 'twitch.twitchId = ratings.creatorId')
      .orderBy('ratings.createDate', 'DESC')
      .offset(itemPerPage * (page - 1))
      .limit(itemPerPage)
      .getRawMany();

    const result = data.map((d) => ({
      rating: d.rating,
      platform: d.platform,
      creatorId: d.creatorId,
      creatorDisplayName: d.platform === 'afreeca' ? d.afreecaStreamerName : d.twitchStreamerName,
      creatorProfileImage: d.platform === 'afreeca' ? d.afreecaLogo : d.twitchLogo,
    }));

    return {
      hasMore: page < totalPage,
      creators: result,
    };
  }

  /**
   * creatorId와 userIp로 평점데이터를 찾아보고
   * 이미 평점을 매긴 경우 평점값을 수정하고,
   * 평점을 매기지 않은 경우 새로운 평점데이터를 생성한다
   * @param creatorId 
   * @param ratingPostDto 
   * @param ip 
   * @returns 
   */
  async createRatings(creatorId: string, ratingPostDto: RatingPostDto, ip: string): Promise<CreatorRatingsEntity> {
    const { userId, rating, platform } = ratingPostDto;

    // 해당 userId로 이미 매겨진 평점이 있는경우, 이미 존재하는 평점을 수정한다
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: { creatorId, userId },
      });

      if (exRating) {
        const updatedRating = await this.ratingsRepository.save({
          ...exRating,
          rating,
        });
        return updatedRating;
      }
      const newRating = await this.ratingsRepository.save({
        creatorId,
        userIp: ip,
        userId,
        rating,
        platform,
      });
      return newRating;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error while creating ratings, creatorId:${creatorId}`);
    }
  }

  /**
   * creatorId와 userId로 평점데이터를 찾아서 삭제한다
   */
  async deleteRatings(creatorId: string, userId: string): Promise<string> {
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          userId,
          creatorId,
        },
      });
      if (exRating) {
        await this.ratingsRepository.remove(exRating);
      }
      return 'ok';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in deleting ratings, creatorId:${creatorId}`);
    }
  }

  /**
   * creatorId의 평균평점과 횟수 조회
   * [tp3.0 특정 기간 반영이 없는 누적 평점 평균치를 게시] 기획에 따라 1달제한 주석처리
   * @param creatorId 
   * @return {
  "average": 2,
  "count": 2
}
   */
  async getAverageRatings(creatorId: string): Promise<{
    average: number,
    count: number
  }> {
    try {
      const data = await this.ratingsRepository.createQueryBuilder('ratings')
        .select([
          'ROUND(AVG(rating),2) AS average',
          'Count(id) AS count',
        ])
        .where('creatorId = :creatorId', { creatorId })
        .getRawOne();
      return {
        average: Number(data.average),
        count: Number(data.count),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in getAverageRatings, creatorId:${creatorId}`);
    }
  }

  /**
   * 해당userId 가진 유저가 creatorId에 매긴 평점 조회
   * 매긴적이 없으면 false반환
   * 매긴적이 있으면 {rating: number}반환
   */
  async findOneRating({ creatorId, userId }: {
    creatorId: string,
    userId?: string | undefined
  }): Promise<{score: number} | false> {
    if (!userId) return false;
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          creatorId,
          userId,
        },
      });
      if (exRating) {
        return { score: exRating.rating };
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in findOneRating, creatorId:${creatorId}`);
    }
  }

  /**
   * 방송인 정보페이지 상단에 사용될 정보
   * @param creatorId 조회하려는 creatorId
   * @returns 
   * {
      ratings: CreatorAverageRatings, // 해당 creator의 평균평점과 횟수 정보
      scores: CreatorAverageScores, // 감탄, 웃음, 답답, 욕점수들
    }
   */
  async getCreatorRatingInfo({ creatorId }: {
    creatorId: string,
  }): Promise<CreatorRatingInfoRes> {
    try {
      // creatorId의 평균 평점과 평가횟수를 찾는다
      const { average, count } = await this.getAverageRatings(creatorId);

      // 1달 내 방송한 전체 방송인 수
      const total = await this.rankingsService.getCreatorCountWithin1Month();

      // 해당 방송인의 평균감정점수와 순위
      const scoresAndRanks = await this.rankingsService.getAverageScoresAndRank(creatorId);
      return {
        ratings: { average, count },
        scores: {
          ...scoresAndRanks,
          total,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in getCreatorRatingInfo, creatorId : ${creatorId}`);
    }
  }

  // 오늘 ~ 7일이전(1주일간) 날짜 'YYYY-MM-DD' 문자열로 반환
  // return ['2021-04-14','2021-04-15','2021-04-16','2021-04-17','2021-04-18','2021-04-19','2021-04-20']
  private getWeekDates(): string[] {
    return new Array(7).fill('').map((val, index) => (
      dayjsFormatter().subtract(index, 'days').format('YYYY-MM-DD')
    )).reverse();
  }

  private filterDataByPlatform(
    data: {platform: 'twitch' | 'afreeca'}[],
    platform: 'twitch' | 'afreeca',
  ): any[] {
    return data.filter((d) => d.platform === platform);
  }

  private getAvgRatingList(
    dates: string[],
    data: {date: string, avgRating: string}[],
  ): number[] {
    return dates.map((date) => {
      const item = data.find((d) => d.date === date);
      if (item) return Number(item.avgRating);
      return 0;
    });
  }

  /**
   * 7일간 아프리카, 트위치 플랫폼 별 크리에이터의 총 평균평점 추이와 날짜 데이터 조회
   * @returns 
   * {
   * dates : ['2021-04-14','2021-04-15','2021-04-16','2021-04-17','2021-04-18','2021-04-19','2021-04-20'],
   * afreeca : [ 3, 4.22, 3.22, 1.22, ...],
   * twitch : [ 3, 4.22, 3.22, 1.22, ...],
   * }
   */
  async weeklyAverageRating(): Promise<{
    dates: string[],
    afreeca: number[],
    twitch: number[]
  }> {
    const dates = this.getWeekDates();
    const query = `
    SELECT 
      DATE_FORMAT(createDate, '%Y-%m-%d') AS "date", 
      ROUND(AVG(rating),2) AS avgRating,
      platform
    FROM ${this.ratingsRepository.metadata.tableName}
    Where
      DATE_FORMAT(createDate, '%Y-%m-%d') 
      BETWEEN (curdate() - interval 7 day)
      AND (curdate())
    GROUP BY date, platform
    Order By date ASC
    `;
    const data = await getConnection().query(query);

    const afreecaData = this.filterDataByPlatform(data, 'afreeca');
    const twitchData = this.filterDataByPlatform(data, 'twitch');

    const afreecaAvgRatings = this.getAvgRatingList(dates, afreecaData);
    const twitchAvgRatings = this.getAvgRatingList(dates, twitchData);

    return {
      dates,
      afreeca: afreecaAvgRatings,
      twitch: twitchAvgRatings,
    };
  }

  /**
   * 이번주 시작일(월요일)~오늘 까지 평점별 상위 10인의 정보와 랭킹순위 구하고
   * 지난주 시작일(지난주 월요일)~지난주 마지막날(지난주 일요일) 평점별 랭킹 순위 구해서
   * 지난주 마지막날 상위 10인의 랭킹과 비교하여
   * 오늘의 랭킹변동순위 조회
   * @returns 
   */
  async getWeeklyRatingsRanking(): Promise<WeeklyRatingRankingRes> {
    const startDayOfThisWeek = dayjsFormatter().day(1); // 0 sunday ~ 6 saturday
    const endDayOfThisWeek = startDayOfThisWeek.add(6, 'day');
    const endDatOfPrevWeek = startDayOfThisWeek.subtract(1, 'day');
    const startDayOfPrevWeek = endDatOfPrevWeek.subtract(1, 'week');

    const query = `
    SELECT 
      This.creatorId AS creatorId,
      This.platform AS platform,
      IFNULL( (CAST(Prev.rownum AS SIGNED) - CAST(This.rownum AS SIGNED)), 9999) AS rankChange,
      ROUND(This.avgRating,2) AS avgRating,
      This.twitchStreamerName AS twitchStreamerName,
      This.twitchLogo AS twitchLogo,
      This.afreecaLogo AS afreecaLogo,
      This.afreecaNickname AS afreecaNickname
    FROM (
      SELECT
        R.creatorId,
        R.platform,
        AVG(R.rating) AS avgRating,
        row_number() over(order by AVG(R.rating) DESC) as rownum,
        twitch.twitchStreamerName AS twitchStreamerName,
        twitch.logo AS twitchLogo,    
        afreeca.logo AS afreecaLogo,
        afreeca.afreecaStreamerName AS afreecaNickname
      FROM ${this.ratingsRepository.metadata.tableName} R
        LEFT JOIN ${this.afreecaRepository.metadata.tableName} afreeca ON afreeca.afreecaId = R.creatorId
        LEFT JOIN ${this.twitchRepository.metadata.tableName} twitch ON twitch.twitchId = R.creatorId
      WHERE R.createDate >= Date("${startDayOfThisWeek.toISOString()}") AND  R.createDate <= (curdate() + INTERVAL 1 DAY)
      GROUP BY R.creatorId
      ORDER BY rownum asc
      LIMIT 10
    ) AS This
    LEFT OUTER JOIN
      (
      SELECT
        creatorId,
        ROW_NUMBER() OVER(ORDER BY AVG(rating) DESC) AS rownum
      FROM ${this.ratingsRepository.metadata.tableName}
      WHERE createDate >= DATE("${startDayOfPrevWeek.toISOString()}") AND createDate <= DATE("${startDayOfThisWeek.toISOString()}")
      GROUP BY creatorId
      ORDER BY rownum asc
      ) AS Prev ON This.creatorId = Prev.creatorId;
    `;

    const data = await getConnection().query(query);
    const result = data.map((d) => ({
      creatorId: d.creatorId,
      platform: d.platform,
      rankChange: Number(d.rankChange),
      averageRating: Number(Number(d.avgRating).toFixed(2)),
      nickname: d.platform === 'twitch' ? d.twitchStreamerName : d.afreecaNickname,
      logo: d.platform === 'twitch' ? d.twitchLogo : d.afreecaLogo,
    }));
    return {
      startDate: startDayOfThisWeek.format('YYYY-MM-DD'),
      endDate: endDayOfThisWeek.format('YYYY-MM-DD'),
      rankingList: result,
    };
  }

  /**
   * 평점별 방송인 순위 목록 가져옴
   * @param limit 조회할 인원 수
   * @returns 
   */
  public async getRankingList({
    platformType,
    categoryId,
    skip,
    limit,
    dateLimit,
  }: {
    platformType: PlatformType,
    categoryId: number,
    skip: number,
    limit: number,
    dateLimit: boolean
  }): Promise<Omit<RankingDataType, 'weeklyTrends'>> {
    let baseQuery: SelectQueryBuilder<CreatorRatingsEntity>;

    baseQuery = await this.ratingsRepository
      .createQueryBuilder('ratings')
      .select([
        'ratings.id AS id',
        'ratings.creatorId AS creatorId',
        'ROUND(AVG(ratings.rating),2) AS rating',
        'ratings.platform AS platform',
      ])
      // .where('ratings.createDate > DATE_SUB(NOW(), INTERVAL 1 DAY)')
      .groupBy('ratings.creatorId')
      .orderBy('AVG(ratings.rating)', 'DESC')
      .addOrderBy('COUNT(ratings.id)', 'DESC');

    if (dateLimit) {
      baseQuery = baseQuery.where('ratings.createDate > DATE_SUB(NOW(), INTERVAL 1 DAY)');
    }

    let qb: SelectQueryBuilder<CreatorRatingsEntity>;
    if (platformType === 'all') {
      qb = await baseQuery
        .addSelect([
          'Twitch.logo AS twitchProfileImage',
          'Twitch.twitchStreamerName AS twitchStreamerName',
          'Twitch.twitchChannelName AS twitchChannelName',
          'Afreeca.logo AS afreecaProfileImage',
          'Afreeca.afreecaStreamerName AS afreecaStreamerName',
        ])
        .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = ratings.creatorId')
        .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = ratings.creatorId');
      if (categoryId !== 0) {
        qb = await qb
          .leftJoin('Afreeca.categories', 'afreecaCategories')
          .leftJoin('Twitch.categories', 'twitchCategories')
          .andWhere(`(afreecaCategories.categoryId = ${categoryId} OR twitchCategories.categoryId = ${categoryId})`);
      }
    } else if (platformType === 'afreeca') {
      qb = await baseQuery
        .addSelect([
          'Afreeca.logo AS afreecaProfileImage',
          'Afreeca.afreecaStreamerName AS afreecaStreamerName',
        ])
        .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = ratings.creatorId')
        .andWhere('ratings.platform =:platformType', { platformType: 'afreeca' });

      if (categoryId !== 0) {
        qb = await qb
          .leftJoin('Afreeca.categories', 'afreecaCategories')
          .andWhere(`(afreecaCategories.categoryId = ${categoryId})`);
      }
    } else if (platformType === 'twitch') {
      qb = await baseQuery
        .addSelect([
          'Twitch.logo AS twitchProfileImage',
          'Twitch.twitchStreamerName AS twitchStreamerName',
          'Twitch.twitchChannelName AS twitchChannelName',
        ])
        .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = ratings.creatorId')
        .andWhere('ratings.platform =:platformType', { platformType: 'twitch' });

      if (categoryId !== 0) {
        qb = await qb
          .leftJoin('Twitch.categories', 'twitchCategories')
          .andWhere(`(twitchCategories.categoryId = ${categoryId})`);
      }
    }

    const totalData = await qb.clone().getRawMany();
    const totalCount = totalData.length;

    const data = await qb
      .offset(skip)
      .limit(limit)
      .getRawMany();

    const rankingData = data.map((d) => ({
      id: d.id,
      creatorId: d.creatorId,
      creatorName: d.platform === 'twitch' ? d.twitchStreamerName : d.afreecaStreamerName,
      platform: d.platform,
      twitchProfileImage: d.twitchProfileImage,
      afreecaProfileImage: d.afreecaProfileImage,
      twitchChannelName: d.twitchChannelName,
      averageRating: d.rating,
    }));

    return {
      totalDataCount: totalCount,
      rankingData,
    };
  }

  /**
   * 일일 평점별 순위 구하는 메서드 (시청자 평점)
   * 
   * 본래 일일 평점별 순위 구하는 함수였으나
   * [tp3.0 특정 기간 반영이 없는 누적 평점 평균치를 게시] 기획에 따라 1달제한 주석처리
   * dateLimit 파라미터에 true 넘기면 일일평점별 순위 반환함
   * 
   * 
   * @param param0 
   * @returns 
   */
  async getDailyRatingRankings(
    {
      skip,
      categoryId,
      platform: platformType,
      dateLimit = false,
    }: {
      skip: number,
      categoryId: number,
      platform: PlatformType,
      dateLimit?: boolean
    },
  ): Promise<RankingDataType> {
    try {
      // 10명 목록 가져옴
      const { totalDataCount, rankingData } = await this.getRankingList({
        skip,
        categoryId,
        platformType,
        limit: 10,
        dateLimit,
      });
      const selectedCreatorsId = rankingData.map((d) => d.creatorId);

      // 해당 10명의 7일간 평점
      const weekData = await this.getRatingTrendsInWeek(selectedCreatorsId);

      return {
        rankingData,
        weeklyTrends: weekData,
        totalDataCount,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // dates에 해당하는 크리에이터 일간 평균 평점
  async getRatingTrendsInWeek(ids: string[]): Promise<WeeklyTrendsType> {
    const dateWeekAgo = dayjs().subtract(7, 'day');

    const result = await ids.reduce(async (promise, id) => {
      const obj = await promise.then();
      const datesArr = Array(7).fill(0).map((_, index) => {
        const date = dayjs().subtract(8 - (index + 1), 'day').format('YYYY-MM-DD');
        return { createDate: date };
      });

      const avgRatings = await this.avgRatingRepository.createQueryBuilder('avgRating')
        .select(['date(date) AS date', 'averageRating'])
        .where(`creatorId = '${id}'`)
        .orderBy('date', 'ASC')
        .getRawMany();

      // avgRating에 일자별로 모든 평균 평점이 저장되어 있지 않음
      // 7일 이전 날짜 중 가장 최근에 저장된 평점 데이터의 인덱스 찾기
      const lastIndex = avgRatings.findIndex((r) => {
        const ratingDate = dayjs(r.date);
        const isSameDate = dateWeekAgo.isSame(ratingDate);
        const isBefore = dateWeekAgo.isBefore(ratingDate);
        return isSameDate || isBefore;
      });

      // 평점 데이터가 없거나 모두 7일 이전에 매겨진 데이터인 경우
      if (lastIndex === -1 || lastIndex === 0) {
        const { averageRating } = avgRatings[avgRatings.length - 1];
        const ratings = datesArr.map((date) => ({ ...date, rating: averageRating }));
        return Promise.resolve({ ...obj, [id]: ratings });
      }

      // 7일 내 매겨진 데이터가 있는 경우, 그 이전 날짜부터 평점 가져옴
      const slicedArr = avgRatings.slice(lastIndex - 1);
      // 날짜에 맞게 평점 데이터 배치(평점 바뀌지 않으면 이전 평점 표시, 바뀐 이후부터는 바뀐 평점 표시)
      const ratings = datesArr.reduce((acc: any[], cur, index: number) => {
        const { createDate } = cur;
        const ratingChangedData = slicedArr.find((r) => r.date === createDate);
        if (ratingChangedData) {
          return [...acc, { ...cur, rating: ratingChangedData.averageRating }];
        }
        if (index === 0) {
          return [...acc, { ...cur, rating: slicedArr[0].averageRating }];
        }
        const lastRating = acc[index - 1].rating;
        return [...acc, { ...cur, rating: lastRating }];
      }, []);

      return Promise.resolve({ ...obj, [id]: ratings });
    }, Promise.resolve({}));

    return result;
  }

  async getAvgRatingsByDateForOneCreator(creatorId: string): Promise<AverageRating[]> {
    try {
      return this.avgRatingRepository.createQueryBuilder('avgRating')
        .select([
          'Date(date) as date',
          'averageRating',
        ])
        .where('creatorId = :creatorId', { creatorId })
        .getRawMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getAvgRatingsByDateForOneCreator');
    }
  }

  /**
   * 매일 자정에 실행되는 방송인 평균 평점 저장 함수
   */
  async saveDailyAverageRating(): Promise<void> {
    try {
      const targetDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      this.logger.log(`${targetDate}의 방송인 평균 평점 저장 시작`);
      // 1. 전날 날짜로 매겨진 방송인 찾기
      const creatorsRatedToday = await this.ratingsRepository.createQueryBuilder('ratings')
        .select(['DISTINCT ratings.creatorId AS creatorId'])
        .where('DATE(ratings.updateDate) = curdate()-1')
        .getRawMany();

      const creatorIds = creatorsRatedToday.map(({ creatorId }: {creatorId: string}) => creatorId);

      // 1-1. 평점 매겨진 방송인이 없는 경우 종료
      if (creatorIds.length === 0) {
        this.logger.log(`${targetDate} 매겨진 평점 없음 - 방송인 평균 평점 저장 종료`);
        return;
      }

      // 2. 해당되는 방송인의 평점 평균 구하기
      const creatorsAndAverageRatings = await this.ratingsRepository.createQueryBuilder('ratings')
        .select([
          'ROUND(AVG(ratings.rating),2) AS averageRating',
          'CURDATE() AS date',
          'ratings.creatorId AS creatorId',
        ])
        .where('ratings.creatorId IN (:creatorIds)', { creatorIds })
        .groupBy('ratings.creatorId')
        .getRawMany();
      this.logger.log(`${targetDate} 매겨진 평점 \n ${JSON.stringify(creatorsAndAverageRatings)}`);

      // 3. 전날 날짜, creatorId, 평점평균 저장하기
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(DailyAverageRatingsEntity)
        .values(creatorsAndAverageRatings)
        .execute();

      this.logger.log('saved in DailyAverageRating, 방송인 평균 평점 저장 종료');
    } catch (error) {
      this.logger.error({ ...error });
      throw new InternalServerErrorException('error in saveDailyAverageRating', error);
    }
  }
}
