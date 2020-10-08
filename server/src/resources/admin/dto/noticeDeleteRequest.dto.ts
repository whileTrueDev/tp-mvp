import {
  IsString
} from 'class-validator';

export class NoticeDelete {
  @IsString()
  id: string;
}
