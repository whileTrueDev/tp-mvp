import {
  IsString
} from 'class-validator';

export class ReplyDeleteRequest {
  @IsString()
  id: string;
}
