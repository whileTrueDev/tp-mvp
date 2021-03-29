import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingPostDto } from '@truepoint/shared/dist/dto/creatorRatings/ratings.dto';
import { CreatorRatingsEntity } from './entities/creatorRatings.entity';

@Injectable()
export class CreatorRatingsService {
  constructor(
    @InjectRepository(CreatorRatingsEntity)
    private readonly ratingsRepository: Repository<CreatorRatingsEntity>,
  ) {}

  /**
   * creatorId와 userIp로 평점데이터를 찾아보고
   * 이미 평점을 매긴 경우 평점값을 수정하고,
   * 평점을 매기지 않은 경우 새로운 평점데이터를 생성한다
   * @param creatorId 
   * @param ratingPostDto 
   * @param ip 
   * @returns 
   */
  async createRatings(creatorId: string, ratingPostDto: RatingPostDto, ip: string): Promise<any> {
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
      throw new InternalServerErrorException('error while creating ratings');
    }
  }

  /**
   * creatorId와 userIp로 평점데이터를 찾아서 삭제한다
   * @param creatorId 
   * @param ip 
   * @returns 
   */
  async deleteRatings(creatorId: string, ip: string): Promise<any> {
    try {
      const exRating = await this.ratingsRepository.findOne({
        where: {
          userIp: ip,
          creatorId,
        },
      });
      await this.ratingsRepository.remove(exRating);
      return 'ok';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error in deleting ratings');
    }
  }

  /**
   * 기준 기간(현재로부터 1달 이내) 내에 매겨진(updateDate가 1달 내인)
   * creatorId의 평균평점과 횟수 조회
   * @param creatorId 
   */
  async getRatings(creatorId: string): Promise<any> {
    const data = await this.ratingsRepository.createQueryBuilder('ratings')
      .select([
        'AVG(rating) AS average',
        'Count(id) AS count',
      ])
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('updateDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)')
      .getRawOne();
    return {
      average: Number(data.average),
      count: Number(data.count),
    };
  }
}
