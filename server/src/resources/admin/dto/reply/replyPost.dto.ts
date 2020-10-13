import {
  IsNumber,
  IsString,
} from 'class-validator';

export class ReplyPostRequest {
  @IsNumber()
  suggestionId: number;

  @IsString()
  content: string;

  @IsString()
  author: string;
}
