import {
  IsString, IsOptional
} from 'class-validator';

export class NoticeGetRequest {
  @IsString()
  @IsOptional()
  id: string;
}
