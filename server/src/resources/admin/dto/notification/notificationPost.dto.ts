import {
  IsString, IsArray,
} from 'class-validator';

export class NotificationPostRequest {
  @IsArray()
  userId: string[];

  @IsString()
  title: string;

  @IsString()
  content: string;
}
