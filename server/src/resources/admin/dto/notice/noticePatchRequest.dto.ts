import {
  IsNumber, IsString, IsBoolean,
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

  @IsBoolean()
  isImportant: boolean;
}
