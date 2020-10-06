import {
  IsString
} from 'class-validator';

export class ReplyPatchRequest {
  @IsString()
  id: string;

  @IsString()
  author: string;

  @IsString()
  content: string;
}
