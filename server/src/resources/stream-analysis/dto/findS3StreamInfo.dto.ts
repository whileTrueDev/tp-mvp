import {
  IsString, IsDateString,
} from 'class-validator';

export class FindS3StreamInfo {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsDateString()
  startedAt: string;
}
