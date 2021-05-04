import {
  BadRequestException, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, SelectQueryBuilder } from 'typeorm';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { RankingDataType, WeeklyTrendsType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import { CreatorRatingInfoRes, WeeklyRatingRankingRes } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { RankingsEntity } from '../rankings/entities/rankings.entity';
import { PlatformType } from '../rankings/rankings.service';
@Injectable()
export class CreatorRatingsService {
  constructor(
    @InjectRepository(CreatorRatingsEntity)
    private readonly ratingsRepository: Repository<CreatorRatingsEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepository: Repository<PlatformAfreecaEntity>,
    @InjectRepository(PlatformTwitchEntity)
    private readonly twitchRepository: Repository<PlatformTwitchEntity>,
    @InjectRepository(RankingsEntity)
    private readonly rankingsRepository: Repository<RankingsEntity>,
  ) {}

  /**
   * rankings테이블에서 해당 creatorId를 가진 값이 존재하는지 확인한다
   * 없으면 400 에러 발생시킴
   * @param creatorId 
   * @returns 
   */
  private async findCreator(creatorId: string): Promise<RankingsEntity> {
    try {
      const creator = await this.rankingsRepository.findOne({
        where: { creatorId },
      });
      if (!creator) {
        throw new BadRequestException(`no creator with creatorId: ${creatorId}`);
      }
      return creator;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
    // 우선 rankings 테이블에서 해당 creatorId가 존재하는지 찾는다
    await this.findCreator(creatorId);

    // 해당 creator가 존재하는 경우 평점을 생성한다
    // 요청 ip로 이미 매겨진 평점이 있는경우 이미 존재하는 평점을 수정한다
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: { userIp: ip, creatorId },
      });

      if (exRating) {
        const updatedRating = await this.ratingsRepository.save({
          ...exRating,
          rating,
          userId: userId || null,
        });
        return updatedRating;
      }
      const newRating = await this.ratingsRepository.save({
        creatorId,
        userIp: ip,
        userId: userId || null,
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
   * creatorId와 userIp로 평점데이터를 찾아서 삭제한다
   * @param creatorId 
   * @param ip 
   * @returns 
   */
  async deleteRatings(creatorId: string, ip: string, userId?: string): Promise<string> {
    await this.findCreator(creatorId);
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          userIp: ip,
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
   * @param creatorId 
   * @return {
  "average": 2,
  "count": 2
}
   */
  async getAverageRatings(creatorId: string): Promise<any> {
    try {
      const data = await this.ratingsRepository.createQueryBuilder('ratings')
        .select([
          'AVG(rating) AS average',
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
   * 해당ip를 가진 유저가 creatorId에 매긴 평점 조회
   * 매긴적이 없으면 false반환
   * 매긴적이 있으면 {rating: number}반환
   * @param ip 
   * @param creatorId 
   * @returns 
   */
  async findOneRating(ip: string, creatorId: string): Promise<{score: number} | false> {
    await this.findCreator(creatorId);
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          userIp: ip,
          creatorId,
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
   * @param ip 접속한 유저의 ip
   * @param creatorId 조회하려는 creatorId
   * @param platform 조회하려는 creator의 플랫폼 'twitch'|'afreeca'
   * @returns 
   * {
      info: CreatorRatingCardInfo, // creator닉네임, 채널명, 프로필이미지 등의 정보
      ratings: CreatorAverageRatings, // 해당 creator의 평균평점과 횟수 정보
      userRating: null | number // 해당 ip로 creatorId에 매겨진 평점
      scores: CreatorAverageScores, // 감탄, 웃음, 답답, 욕점수들
    }
   */
  async getCreatorRatingInfo(
    ip: string,
    creatorId: string,
    platform: 'twitch'|'afreeca',
  ): Promise<CreatorRatingInfoRes> {
    const result = {
      ratings: {
        average: 0,
        count: 0,
      },
      scores: {
        admire: 0,
        smile: 0,
        frustrate: 0,
        cuss: 0,
      },
      info: {
        creatorId,
        platform,
        logo: '',
        nickname: '',
        twitchChannelName: null,
      },
    };
    // creatorId의 평균 평점과 평가횟수를 찾는다
    const { average, count } = await this.getAverageRatings(creatorId);
    result.ratings = { average, count };

    // 크리에이터의 1달 내 평균점수, 닉네임, 로고 정보를 찾는다
    const { recentCreateDate } = await this.rankingsRepository.createQueryBuilder('rank')
      .select('max(rank.createDate) AS recentCreateDate')
      .getRawOne();

    const qb = await this.rankingsRepository.createQueryBuilder('rankings')
      .select([
        'AVG(smileScore) AS smile',
        'AVG(frustrateScore) AS frustrate',
        'AVG(admireScore) AS admire',
        'AVG(cussScore) AS cuss',
      ])
      .where('creatorId = :creatorId', { creatorId })
      .andWhere(`createDate >= DATE_SUB('${recentCreateDate}', INTERVAL 1 MONTH)`)
      .getRawOne();

    result.scores.admire = qb.admire;
    result.scores.smile = qb.smile;
    result.scores.frustrate = qb.frustrate;
    result.scores.cuss = qb.cuss;

    try {
      if (platform === 'twitch') {
        const twitchData = await this.twitchRepository.findOne({
          where: {
            twitchId: creatorId,
          },
          select: ['twitchStreamerName', 'twitchChannelName', 'logo'],
        });

        result.info.logo = twitchData.logo;
        result.info.nickname = twitchData.twitchStreamerName;
        result.info.twitchChannelName = twitchData.twitchChannelName;
      } else if (platform === 'afreeca') {
        const afreecaData = await this.afreecaRepository.findOne({
          where: {
            afreecaId: creatorId,
          },
          select: ['logo', 'afreecaStreamerName'],
        });
        result.info.logo = afreecaData.logo;
        result.info.nickname = afreecaData.afreecaStreamerName;
      }

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in getCreatorRatingInfo, creatorId : ${creatorId}`);
    }
  }

  // 어제 ~ 8일이전(1주일간) 날짜 'YYYY-MM-DD' 문자열로 반환
  // return ['2021-04-14','2021-04-15','2021-04-16','2021-04-17','2021-04-18','2021-04-19','2021-04-20']
  private getWeekDates(): string[] {
    return new Array(7).fill('').map((val, index) => (
      dayjs().subtract(index + 1, 'days').format('YYYY-MM-DD')
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
      CAST(AVG(rating) as decimal(10,2)) AS avgRating,
      platform
    FROM ${this.ratingsRepository.metadata.tableName}
    Where
      DATE_FORMAT(createDate, '%Y-%m-%d') 
      BETWEEN (curdate() - interval 8 day)
      AND (curdate() - interval 1 day)
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
   * 지난주(어제~8일전) 평점별 상위 10인의 정보와 랭킹순위 구하고
   * 지지난주(9일전 ~ 16일전) 평점별 랭킹 순위 구해서
   * 지난주 상위 10인의 주간평균평점과 랭킹변동순위 조회
   * @returns 
   */
  async getWeeklyRatingsRanking(): Promise<WeeklyRatingRankingRes> {
    const dates = this.getWeekDates();
    // const thisWeekMonday = dayjs().day(1);

    const query = `
    SELECT 
      This.creatorId AS creatorId,
      This.platform AS platform,
      IFNULL( (CAST(Prev.rownum AS SIGNED) - CAST(This.rownum AS SIGNED)), 9999) AS rankChange,
      This.avgRating AS avgRating,
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
      WHERE TIMESTAMPDIFF(DAY, R.createDate, NOW())>=1 AND TIMESTAMPDIFF(DAY, R.createDate, NOW())<=8  
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
      WHERE TIMESTAMPDIFF(DAY, createDate, NOW()) >=9 AND TIMESTAMPDIFF(DAY, createDate, NOW()) <= 16
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
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      rankingList: result,
    };
  }

  async getDailyRatingRankings(
    { skip, categoryId, platform: platformType }: {
      skip: number,
      categoryId: number,
      platform: PlatformType
    },
  ): Promise<RankingDataType> {
    try {
      const baseQuery = await this.ratingsRepository
        .createQueryBuilder('ratings')
        .select([
          'ratings.id AS id',
          'ratings.creatorId AS creatorId',
          'AVG(ratings.rating) AS rating',
          'ratings.platform AS platform',
        ])
        .where('DATE_FORMAT(ratings.createDate, \'%Y-%m-%d\') = (curdate() - interval 1 day)')
        .groupBy('ratings.creatorId')
        .orderBy('AVG(ratings.rating)', 'DESC')
        .addOrderBy('COUNT(ratings.id)', 'DESC');

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
          .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = ratings.creatorId')
          .leftJoin('Afreeca.categories', 'afreecaCategories')
          .leftJoin('Twitch.categories', 'twitchCategories')
          .andWhere(`(afreecaCategories.categoryId = ${categoryId} OR twitchCategories.categoryId = ${categoryId})`);
      } else if (platformType === 'afreeca') {
        qb = await baseQuery
          .addSelect([
            'Afreeca.logo AS afreecaProfileImage',
            'Afreeca.afreecaStreamerName AS afreecaStreamerName',
          ])
          .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = ratings.creatorId')
          .leftJoin('Afreeca.categories', 'afreecaCategories')
          .andWhere('ratings.platform =:platformType', { platformType: 'afreeca' })
          .andWhere(`(afreecaCategories.categoryId = ${categoryId})`);
      } else if (platformType === 'twitch') {
        qb = await baseQuery
          .addSelect([
            'Twitch.logo AS twitchProfileImage',
            'Twitch.twitchStreamerName AS twitchStreamerName',
            'Twitch.twitchChannelName AS twitchChannelName',
          ])
          .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = ratings.creatorId')
          .leftJoin('Twitch.categories', 'twitchCategories')
          .andWhere('ratings.platform =:platformType', { platformType: 'twitch' })
          .andWhere(`(twitchCategories.categoryId = ${categoryId})`);
      }

      const totalData = await qb.clone().getRawMany();
      const totalCount = totalData.length;

      const data = await qb
        .offset(skip)
        .limit(10)
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

      const selectedCreatorsId = data.map((d) => d.creatorId);
      const dates = this.getWeekDates();

      const weekData = await this.getRatingTrendsInWeek(selectedCreatorsId, dates);

      return {
        rankingData,
        weeklyTrends: weekData,
        totalDataCount: totalCount,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // dates에 해당하는 크리에이터 일간 평균 평점
  async getRatingTrendsInWeek(ids: string[], dates: string[]): Promise<WeeklyTrendsType> {
    const data = await this.ratingsRepository.createQueryBuilder('ratings')
      .select([
        'ratings.creatorId AS creatorId',
        'AVG(ratings.rating) AS avgRating',
        'DATE_FORMAT(ratings.createDate, "%Y-%m-%d") AS date',
      ])
      .where(`ratings.creatorId IN ('${ids.join("','")}')`)
      .andWhere(`DATE_FORMAT(ratings.createDate, "%Y-%m-%d") IN ('${dates.join("','")}')`)
      .groupBy('ratings.creatorId')
      .addGroupBy('date')
      .orderBy('ratings.creatorId')
      .addOrderBy('date', 'ASC')
      .getRawMany();

    // 데이터를 
    // {[creatorId] : [{"createDate": "2021-04-16","rating": 3.25}, ... ]}
    // 형태로 바꿈
    const result = ids.reduce((resultObj, id) => ({
      ...resultObj,
      [id]: dates.map((d) => {
        const dateMatchedItem: {date: string; avgRating: number} = data.find((item) => (
          item.date === d && item.creatorId === id
        ));
        return {
          createDate: d,
          rating: dateMatchedItem ? dateMatchedItem.avgRating : 0,
        };
      }),
    }), {});

    return result;
  }
}
