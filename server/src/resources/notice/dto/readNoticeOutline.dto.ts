import { IsNumber } from 'class-validator';

export class ReadNoticeOutlineDto {
  @IsNumber()
  important: number;

  @IsNumber()
  newOne: number;
}
