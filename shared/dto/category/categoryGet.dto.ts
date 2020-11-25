import {
  IsString,
} from 'class-validator';

export class CategoryGetRequest {
  @IsString()
  categoryId: number;

  @IsString()
  category: string;

  @IsString()
  categoryName: string;
}
