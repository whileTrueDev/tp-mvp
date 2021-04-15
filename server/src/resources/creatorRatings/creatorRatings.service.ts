import {
  BadRequestException, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatingInfoRes, ListItemOrderByRatings } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { RankingsEntity } from '../rankings/entities/rankings.entity';
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
    // 우선 rankings 테이블에서 해당 creatorId가 존재하는지 찾는다
    await this.findCreator(creatorId);

    // 해당 creator가 존재하는 경우 평점을 생성한다
    // 요청 ip로 이미 매겨진 평점이 있는경우 이미 존재하는 평점을 수정한다
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          userIp: ip,
          creatorId,
        },
      });
      if (exRating) {
        const updatedRating = await this.ratingsRepository.save({
          ...exRating,
          rating: ratingPostDto.rating,
        });
        return updatedRating;
      }
      const newRating = await this.ratingsRepository.save({
        creatorId,
        userIp: ip,
        ...ratingPostDto,
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
  async deleteRatings(creatorId: string, ip: string): Promise<string> {
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
      userRating: null,
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
    // 유저ip로 매긴 평점을 찾는다
    const exRating = await this.findOneRating(ip, creatorId);
    if (exRating) {
      result.userRating = exRating.score;
    }
    // creatorId의 평균 평점과 평가횟수를 찾는다
    const { average, count } = await this.getAverageRatings(creatorId);
    result.ratings = { average, count };

    // 크리에이터의 1달 내 평균점수, 닉네임, 로고 정보를 찾는다
    const qb = this.rankingsRepository.createQueryBuilder('rankings')
      .select([
        'AVG(smileScore) AS smile',
        'AVG(frustrateScore) AS frustrate',
        'AVG(admireScore) AS admire',
        'AVG(cussScore) AS cuss',
      ])
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('createDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)');
    let data: {
      admire: number,
      amile: number,
      smile: number,
      frustrate: number,
      cuss: number,
      logo: string,
      nickname: string,
      twitchChannelName?: string
    };
    try {
      if (platform === 'twitch') {
        data = await qb
          .addSelect([
            'twitch.twitchStreamerName AS nickname',
            'twitch.twitchChannelName AS twitchChannelName',
            'twitch.logo AS logo',
          ])
          .leftJoin(PlatformTwitchEntity, 'twitch', 'twitch.twitchId = rankings.creatorId')
          .getRawOne();
      } else if (platform === 'afreeca') {
        data = await qb
          .addSelect([
            'afreeca.logo AS logo',
            'afreeca.afreecaStreamerName AS nickname',
          ])
          .leftJoin(PlatformAfreecaEntity, 'afreeca', 'afreeca.afreecaId = rankings.creatorId')
          .getRawOne();
      }
      result.scores.admire = data.admire;
      result.scores.smile = data.smile;
      result.scores.frustrate = data.frustrate;
      result.scores.cuss = data.cuss;
      result.info.logo = data.logo;
      result.info.nickname = data.nickname;
      result.info.twitchChannelName = data.twitchChannelName;

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in getCreatorRatingInfo, creatorId : ${creatorId}`);
    }
  }

  /**
   * 주간 집계 시청자 평점 순위별 크리에이터 목록 반환
   * @param take 
   * @param skip 
   * @returns 
   */
  async getListOrderByRatings(take: number, skip: number): Promise<ListItemOrderByRatings[]> {
    const data: {
      'creatorId': string,
      'averageRating': string,
      'ratingCount': string,
      'twitchNickname': string | null,
      'twitchChannelName': string | null,
      'twitchLogo': string | null,
      'afreecaLogo': string | null,
      'afreecaNickname': string | null
    }[] = await this.ratingsRepository
      .createQueryBuilder('Ratings')
      .select([
        'Ratings.creatorId AS creatorId',
        'AVG(Ratings.rating) AS averageRating',
        'COUNT(Ratings.id) AS ratingCount',
      ])
      .where('Ratings.createDate >= DATE_SUB(NOW(), INTERVAL 1 WEEK)')
      .addSelect([
        'Twitch.twitchStreamerName AS twitchNickname',
        'Twitch.twitchChannelName AS twitchChannelName',
        'Twitch.logo AS twitchLogo',
      ])
      .addSelect([
        'Afreeca.logo AS afreecaLogo',
        'Afreeca.afreecaStreamerName AS afreecaNickname',
      ])
      .leftJoin(PlatformTwitchEntity, 'Twitch', 'Twitch.twitchId = Ratings.creatorId')
      .leftJoin(PlatformAfreecaEntity, 'Afreeca', 'Afreeca.afreecaId = Ratings.creatorId')
      .groupBy('Ratings.creatorId')
      .orderBy('AVG(Ratings.rating)', 'DESC') // 평점 높은 순
      .addOrderBy('COUNT(Ratings.id)', 'DESC') // 평점 같으면 평점횟수 높은 순
      .limit(take)
      .offset(skip)
      .getRawMany();

    const result = data.map((d) => ({
      creatorId: d.creatorId,
      averageRating: Number(d.averageRating),
      ratingCount: Number(d.ratingCount),
      nickname: d.twitchNickname || d.afreecaNickname || '',
      logo: d.twitchLogo || d.afreecaLogo || '',
      platform: d.twitchChannelName ? 'twitch' : 'afreeca',
    }));

    return result;
  }
}
