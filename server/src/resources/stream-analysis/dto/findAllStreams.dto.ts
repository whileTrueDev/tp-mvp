import {
  IsString, IsDateString, IsOptional
} from 'class-validator';

export class FindAllStreams {
  @IsString()
  userId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
