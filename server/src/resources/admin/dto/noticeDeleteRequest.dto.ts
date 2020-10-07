import {
  IsNumber
} from 'class-validator';

export class NoticeDelete {
  @IsNumber()
  id: number;
}
