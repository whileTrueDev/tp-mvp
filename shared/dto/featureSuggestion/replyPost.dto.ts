import {
  IsNumber,
  IsString,
} from 'class-validator';

export class ReplyPost {
  @IsNumber()
  suggestionId: number;

  @IsString()
  content: string;

  @IsString()
  author: string;
}
