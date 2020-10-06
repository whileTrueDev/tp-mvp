import {
  IsString, IsOptional
} from 'class-validator';

export class ReplyGetRequest {
  @IsString()
  @IsOptional()
  id: string;
}
