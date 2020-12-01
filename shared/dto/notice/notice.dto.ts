import {
  IsNumber, IsString, IsOptional, IsBoolean,
} from 'class-validator';

export class NoticeDto {
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

  @IsBoolean()
  isImportant: boolean;
}
