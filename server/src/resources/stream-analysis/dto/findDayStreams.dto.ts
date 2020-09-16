import {
  IsString, IsDateString
} from 'class-validator';

export class FindDayStreams {
  @IsString()
  userId: string;

  @IsDateString()
  date: string;
}
