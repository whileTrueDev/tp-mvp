import {
  IsString
} from 'class-validator';

export class ReplyPostRequest {
  @IsString()
  suggestionId: string;

  @IsString()
  content: string;

  @IsString()
  author: string;
}
