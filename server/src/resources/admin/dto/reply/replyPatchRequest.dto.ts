import {
  IsNumber,
  IsString,
} from 'class-validator';

export class ReplyPatchRequest {
  @IsNumber()
  id: number;

  @IsString()
  author: string;

  @IsString()
  content: string;
}
