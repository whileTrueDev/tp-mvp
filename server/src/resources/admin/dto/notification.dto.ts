import {
  IsString, IsOptional
} from 'class-validator';

export class Notification {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  readState: string;

  @IsString()
  userId: string;

  @IsString()
  isImportant: number;
}
