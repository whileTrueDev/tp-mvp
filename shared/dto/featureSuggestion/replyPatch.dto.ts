import {
  IsNumber,
  IsString,
} from 'class-validator';

export class ReplyPatch {
  @IsNumber()
  id: number;

  @IsString()
  author: string;

  @IsString()
  content: string;
}
