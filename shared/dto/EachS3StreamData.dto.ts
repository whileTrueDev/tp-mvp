import {
  IsString, IsDateString,
} from 'class-validator';

export class EachS3StreamData {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsDateString()
  startedAt: string;
}
