import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCreatorToCategoryDto } from '@truepoint/shared/dist/dto/category/addCreatorToCategoryPost.dto';
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

  public async findAllCategories(): Promise<CreatorCategoryEntity[]> {
    return this.creatorCategoryRepository.find();
  }

  async createCategory(categoryName: string): Promise<any> {
    return this.creatorCategoryRepository.save({ name: categoryName });
  }

  async addCreatorToCategory(
    dto: AddCreatorToCategoryDto,
  ): Promise<PlatformTwitchEntity | PlatformAfreecaEntity> {
    const category = await this.creatorCategoryRepository.findOne({
      where: { categoryId: dto.categoryId },
    });
    let result: any;

    if (dto.platform === 'twitch') {
      const creator = await this.twitchRepository.findOne({
        where: { twitchId: dto.creatorId },
      });
      creator.categories = [category];
      result = await this.twitchRepository.save(creator);
    } if (dto.platform === 'afreeca') {
      const creator = await this.afreecaRepository.findOne({
        where: { afreecaId: dto.creatorId },
      });
      creator.categories = [category];
      result = await this.afreecaRepository.save(creator);
    }
    return result;
  }
}
