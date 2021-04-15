import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorCategoryEntity } from './entities/creatorCategory.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';

@Injectable()
export class CreatorCategoryService {
  constructor(
    @InjectRepository(CreatorCategoryEntity)
    private readonly creatorCategoryRepository: Repository<CreatorCategoryEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepository: Repository<PlatformAfreecaEntity>,
    @InjectRepository(PlatformTwitchEntity)
    private readonly twitchRepository: Repository<PlatformTwitchEntity>,
  ) {}

  async createCategory(categoryName: string): Promise<any> {
    return this.creatorCategoryRepository.save({ name: categoryName });
  }

  async addCreatorToCategory(platform: string, creatorId: string, categoryId: number): Promise<any> {
    const category = await this.creatorCategoryRepository.findOne({
      where: { categoryId },
    });
    let result: any;

    if (platform === 'twitch') {
      const creator = await this.twitchRepository.findOne({
        where: {
          twitchId: creatorId,
        },
      });
      creator.categories = [category];
      result = await this.twitchRepository.save(creator);
    } if (platform === 'afreeca') {
      const creator = await this.afreecaRepository.findOne({
        where: {
          afreecaId: creatorId,
        },
      });
      creator.categories = [category];
      result = await this.afreecaRepository.save(creator);
    }
    return result;
  }
}
