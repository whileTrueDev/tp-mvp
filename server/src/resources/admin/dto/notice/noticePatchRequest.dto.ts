import {
  IsNumber, IsString,
} from 'class-validator';

export class NoticePatchRequest {
  @IsNumber()
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
