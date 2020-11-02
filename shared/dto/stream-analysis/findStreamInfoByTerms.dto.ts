import {
  IsString, IsDateString,
} from 'class-validator';

export class FindStreamInfoByTerms {
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
