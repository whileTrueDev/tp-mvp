import {
  IsString, IsOptional
} from 'class-validator';

export class NoticePatch {
  @IsString()
  id: string;

  @IsString()
  category: string;

  @IsString()
  author: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  isImportant: number;
}
