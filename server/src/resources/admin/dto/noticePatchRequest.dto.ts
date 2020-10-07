import {
  IsString, IsInt,
} from 'class-validator';

export class NoticePatch {
  @IsInt()
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
