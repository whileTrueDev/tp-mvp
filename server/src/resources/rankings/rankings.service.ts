import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { RankingsEntity } from './entities/rankings.entity';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(RankingsEntity)
    private readonly rankingsRepository: Repository<RankingsEntity>,
  ) {}

  async test(): Promise<any> {
    return this.rankingsRepository.find();
  }

  async getTopTenViewerByPlatform(): Promise<any> {
    const data = await this.rankingsRepository
      .createQueryBuilder('rankings')
      .select('rankings.createDate')
      .addSelect('rankings.creatorName')
      .addSelect('rankings.viewer')
      .orderBy('rankings.viewer', 'DESC');

    // .from((subQuery) => subQuery
    //   .select('r.*')
    //   .from(RankingsEntity, 'r')
    //   .orderBy('r.createDate', 'DESC'), 'rankings')
    // .groupBy('rankings.creatorName')
    // .getSql();
    // const d = await getConnection().createQueryBuilder()
    //   .select('sub.creatorName')
    //   .from((qb) => qb
    //     .select('r.createDate', 'r.creatorName')
    //     .from(RankingsEntity, 'r')
    //     .orderBy('r.createDate', 'DESC'), 'sub')
    //   .getMany();

    return data;
  }
}
