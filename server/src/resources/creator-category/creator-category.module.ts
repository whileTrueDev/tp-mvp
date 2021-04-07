import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorCategoryController } from './creator-category.controller';
import { CreatorCategoryService } from './creator-category.service';
import { CreatorCategoryEntity } from './entities/creatorCategory.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    CreatorCategoryEntity,
    PlatformAfreecaEntity,
    PlatformTwitchEntity,
  ])],
  controllers: [CreatorCategoryController],
  providers: [CreatorCategoryService],
})

export class CreatorCategoryModule {}
