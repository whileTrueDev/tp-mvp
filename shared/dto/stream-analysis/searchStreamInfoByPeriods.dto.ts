import {
  IsString, IsDateString,
} from 'class-validator';

export class SearchStreamInfoByPeriods {
  @IsString()
  userId: string;

  @IsDateString()
  baseStartAt: string;

  @IsDateString()
  baseEndAt: string;

  @IsDateString()
  compareStartAt: string;

  @IsDateString()
  compareEndAt: string;
}
