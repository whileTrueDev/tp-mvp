import {
  IsString, IsDateString,
} from 'class-validator';

export class EachS3StreamInfo {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsDateString()
  startedAt: string;
}
