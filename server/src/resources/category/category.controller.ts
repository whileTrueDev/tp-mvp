import {
  Controller, UseGuards, Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

// service
import { CategoryService } from './category.service';
// entity
import { CategoryEntity } from './entities/category.entity';
// pipe
// import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }
}
