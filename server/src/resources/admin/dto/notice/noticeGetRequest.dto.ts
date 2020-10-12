import {
  IsNumberString, IsOptional
} from 'class-validator';

export class NoticeGetRequest {
  @IsNumberString()
  @IsOptional()
  id: number;
}
