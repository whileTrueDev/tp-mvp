import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
// words 는 아직 사용하지 않음
// import { CategoricalWordsEntity } from './entities/categoricalWords.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * 카테고리 DB 테이블 존재 하는 모든 카테고리값 조회후 리턴
   */
  async findAll(): Promise<CategoryEntity[]> {
    const findResult = this.categoryRepository
      .find()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Category ... ');
      });

    return findResult;
  }
}
