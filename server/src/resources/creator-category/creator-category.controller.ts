import {
  Body, Controller, Get, Post,
} from '@nestjs/common';
import { AddCreatorToCategoryDto } from '@truepoint/shared/dist/dto/category/addCreatorToCategoryPost.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { CreatorCategoryService } from './creator-category.service';
import { CreatorCategoryEntity } from './entities/creatorCategory.entity';

@Controller('creator-category')
export class CreatorCategoryController {
  constructor(
    private readonly categoryService: CreatorCategoryService,
  ) {}

  // *************************************************
  // 카테고리

  @Get('/')
  findCategories(): Promise<CreatorCategoryEntity[]> {
    return this.categoryService.findAllCategories();
  }

  // add category
  @Post('/')
  createCategory(
    @Body('name', ValidationPipe) name: string,
  ): any {
    return this.categoryService.createCategory(name);
  }

  // *************************************************
  // 크리에이터 - 카테고리
  /**
   * add creator
   */
  @Post('/creator')
  addCreatorToCategory(
    @Body(ValidationPipe) dto: AddCreatorToCategoryDto,
  ): Promise<PlatformTwitchEntity | PlatformAfreecaEntity> {
    return this.categoryService.addCreatorToCategory(dto);
  }
}
