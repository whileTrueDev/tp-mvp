import {
  IsString
} from 'class-validator';

export class NotificationPostRequest {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
