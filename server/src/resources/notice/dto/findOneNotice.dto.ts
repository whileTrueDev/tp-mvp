import { IsNumber } from 'class-validator';

export class FindOneNoticeDto {
  @IsNumber()
  id: number;
}
