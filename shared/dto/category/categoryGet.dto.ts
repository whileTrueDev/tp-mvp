import {
  IsString,
} from 'class-validator';

export class CategoryGetRequest {
  @IsString()
  categoryId: string;

  @IsString()
  category: string;

  @IsString()
  categoryName: string;
}
