import {
  IsString, IsDateString, IsOptional,
  Length,
} from 'class-validator';

const userIdMinLength = 4;
const userIdMaxLength = 15;

export class SearchCalendarStreams {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
