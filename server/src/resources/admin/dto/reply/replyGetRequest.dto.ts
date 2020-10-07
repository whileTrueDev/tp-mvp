import {
  IsNumberString, IsOptional
} from 'class-validator';

export class ReplyGetRequest {
  @IsNumberString()
  @IsOptional()
  id: number;
}
