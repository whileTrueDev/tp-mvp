import {
  IsNumber, IsString, IsOptional,
} from 'class-validator';

export class Notice {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  category: string;

  @IsString()
  author: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  isImportant: boolean;
}
