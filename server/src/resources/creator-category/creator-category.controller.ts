import {
  Body, Controller, Post,
} from '@nestjs/common';
import { CreatorCategoryService } from './creator-category.service';

@Controller('creator-category')
export class CreatorCategoryController {
  constructor(
    private readonly categoryService: CreatorCategoryService,
  ) {}

  /**
   * add creator
   */
  @Post('/creator')
  addCreatorToCategory(
    @Body('creatorId') creatorId: string,
    @Body('platform') platform: string,
    @Body('categoryId') categoryId: number,
  ): any {
    return this.categoryService.addCreatorToCategory(platform, creatorId, categoryId);
  }

  // add category
  @Post('/category')
  createCategory(
    @Body('name') name: string,
  ): any {
    return this.categoryService.createCategory(name);
  }
}
