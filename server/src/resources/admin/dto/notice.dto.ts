import {
  IsString, IsOptional, IsInt
} from 'class-validator';

export class Notice {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  category: string;

  @IsString()
  author: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  isImportant: number;
}
