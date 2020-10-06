import {
  IsString, IsOptional
} from 'class-validator';

export class NotificationGetRequest {
  @IsString()
  @IsOptional()
  userId: string;
}
